// 💫 FORWARD ALL — Umar Farooq Edition (Final Fixed v2)
// Made with ❤️ by whiteshadow + Umar

const { cmd } = require("../command");
const fs = require("fs");

const TRACK_FILE = "./forward-tracker.json";

// Auto create tracker file if missing
if (!fs.existsSync(TRACK_FILE)) fs.writeFileSync(TRACK_FILE, JSON.stringify([]));

const SAFETY = {
  MAX_JIDS: 1000,
  DELAY: 2000,
};

// 🧾 Help message (for reuse)
const HELP_MSG = `⚙️ *Forward Command Help*

📤 *Usage:*
1. Reply to a message then type:
   • .fwd all → Send to *all chats & groups*
   • .fwd 5 chats 3 groups → Send to limited chats/groups
   • .fwd del all → Delete all forwarded messages

💡 *Examples:*
> .fwd all  
> .fwd 10 chats 5 groups  
> .fwd del all`;

cmd({
  pattern: "forward",
  alias: ["fwd"],
  desc: "Forward a replied message to all chats & groups.",
  category: "owner",
  filename: __filename
}, async (conn, m, match, { isOwner }) => {
  try {
    if (!isOwner) return await m.reply("⚠️ *Owner Only Command!*");

    const input = (typeof match === "string" ? match.trim() : "");
    const args = input.split(/\s+/).filter(a => a);

    // =============== HELP ===============
    if (!args.length) return await m.reply(HELP_MSG);

    // =============== DELETE MODE ===============
    if (args[0] === "del" && args[1] === "all") {
      const tracker = JSON.parse(fs.readFileSync(TRACK_FILE));
      if (!tracker.length) return await m.reply("⚠️ No forwarded messages to delete.");
      let deleted = 0;
      for (const x of tracker) {
        try {
          await conn.sendMessage(x.jid, {
            delete: { remoteJid: x.jid, fromMe: true, id: x.msgId }
          });
          deleted++;
        } catch {}
        await new Promise(r => setTimeout(r, 500));
      }
      fs.writeFileSync(TRACK_FILE, JSON.stringify([]));
      return await m.reply(`🗑️ Deleted ${deleted} messages.`);
    }

    // =============== FORWARD MODE ===============
    if (!m.quoted) return await m.reply("⚠️ Please reply to a message to forward.");

    // Auto fetch chats + groups
    const contacts = Object.keys(conn.contacts || {});
    const groupsData = await conn.groupFetchAllParticipating().catch(() => ({}));
    const groupJids = Object.keys(groupsData);
    let allJids = [...new Set([...contacts, ...groupJids])];
    allJids = allJids.filter(jid => jid.endsWith("@s.whatsapp.net") || jid.endsWith("@g.us"));

    if (allJids.length === 0)
      return await m.reply("❌ No chats or groups found.");

    let chatLimit = 0, groupLimit = 0;
    if (args[0] === "all") {
      chatLimit = groupLimit = Infinity;
    } else if (args.length >= 3) {
      const chatIndex = args.indexOf("chats");
      const groupIndex = args.indexOf("groups");
      chatLimit = chatIndex > 0 ? parseInt(args[chatIndex - 1]) || 0 : 0;
      groupLimit = groupIndex > 0 ? parseInt(args[groupIndex - 1]) || 0 : 0;
      if (isNaN(chatLimit) && isNaN(groupLimit)) return await m.reply(HELP_MSG);
    } else {
      return await m.reply(HELP_MSG);
    }

    const chats = allJids.filter(j => j.endsWith("@s.whatsapp.net")).slice(0, chatLimit || Infinity);
    const groups = allJids.filter(j => j.endsWith("@g.us")).slice(0, groupLimit || Infinity);
    const sendList = [...chats, ...groups].slice(0, SAFETY.MAX_JIDS);

    if (sendList.length === 0) return await m.reply("❌ No valid chats or groups to send.");

    await m.reply(`🚀 Forwarding to ${sendList.length} destinations (${chats.length} chats, ${groups.length} groups)...`);

    const q = m.quoted;
    const mtype = q.mtype;
    let content = {};

    if (["imageMessage", "videoMessage", "audioMessage", "stickerMessage", "documentMessage"].includes(mtype)) {
      const buffer = await q.download();
      switch (mtype) {
        case "imageMessage": content = { image: buffer, caption: q.text || "" }; break;
        case "videoMessage": content = { video: buffer, caption: q.text || "" }; break;
        case "audioMessage": content = { audio: buffer, ptt: q.ptt || false }; break;
        case "stickerMessage": content = { sticker: buffer }; break;
        case "documentMessage": content = { document: buffer, fileName: q.fileName || "file" }; break;
      }
    } else {
      content = { text: q.text || q.caption || " " };
    }

    const tracker = JSON.parse(fs.readFileSync(TRACK_FILE));
    let success = 0;

    for (let i = 0; i < sendList.length; i++) {
      try {
        const sent = await conn.sendMessage(sendList[i], content);
        tracker.push({ jid: sendList[i], msgId: sent.key.id });
        success++;
      } catch {}
      if ((i + 1) % 20 === 0)
        await m.reply(`📤 Progress: ${i + 1}/${sendList.length}`);
      await new Promise(r => setTimeout(r, SAFETY.DELAY));
    }

    fs.writeFileSync(TRACK_FILE, JSON.stringify(tracker, null, 2));
    await m.reply(`✅ Forwarded to *${success}/${sendList.length}* chats/groups successfully!`);

  } catch (err) {
    console.error("Forward Error:", err);
    await m.reply("💢 Error: " + err.message);
  }
});
