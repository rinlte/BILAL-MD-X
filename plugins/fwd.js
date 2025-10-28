// 💫 FORWARD ALL — Umar Farooq Edition (Final PRO)
// Made with ❤️ by whiteshadow + Umar

const { cmd } = require("../command");
const fs = require("fs");

const TRACK_FILE = "./forward-tracker.json";
if (!fs.existsSync(TRACK_FILE)) fs.writeFileSync(TRACK_FILE, JSON.stringify([]));

const SAFETY = {
  MAX_JIDS: 2000,
  DELAY: 2000,
};

cmd({
  pattern: "forward",
  alias: ["fwd"],
  desc: "Forward replied message to chats/groups — full control.",
  category: "owner",
  filename: __filename
}, async (conn, m, match, { isOwner }) => {
  try {
    if (!isOwner) return await m.reply("⚠️ *Owner Only Command!*");

    let args = (typeof match === "string" ? match.trim().split(/\s+/) : []);

    // ===== HELP MODE =====
    if (!args[0]) {
      return await m.reply(
`⚙️ *Forward Command Help*

📤 *Usage:*
1. Reply to a message then type:
   • .fwd all → Send to *all chats & groups*
   • .fwd 5 chats 3 groups → Send to limited chats/groups
   • .fwd del all → Delete all forwarded messages

💡 *Examples:*
> .fwd all  
> .fwd 10 chats 5 groups  
> .fwd del all`
      );
    }

    // ===== DELETE MODE =====
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
      return await m.reply(`🗑️ Deleted ${deleted} messages successfully.`);
    }

    // ===== FORWARD MODE =====
    if (!m.quoted) return await m.reply("⚠️ Please *reply* to a message* to forward.");

    let allChats = [];
    let allGroups = [];

    // Get chats
    const contacts = Object.keys(conn.contacts || {});
    const groups = await conn.groupFetchAllParticipating().catch(() => ({}));
    const groupJids = Object.keys(groups);

    allChats = contacts.filter(j => j.endsWith("@s.whatsapp.net"));
    allGroups = groupJids.filter(j => j.endsWith("@g.us"));

    if (!allChats.length && !allGroups.length)
      return await m.reply("❌ No chats or groups found. Try messaging someone first.");

    // ===== LIMIT HANDLING =====
    let chatLimit = 0;
    let groupLimit = 0;

    if (args[0] === "all") {
      chatLimit = allChats.length;
      groupLimit = allGroups.length;
    } else {
      const chatIndex = args.indexOf("chats");
      const groupIndex = args.indexOf("groups");
      if (chatIndex > 0) chatLimit = parseInt(args[chatIndex - 1]) || 0;
      if (groupIndex > 0) groupLimit = parseInt(args[groupIndex - 1]) || 0;
    }

    // Apply limits safely
    const selectedChats = allChats.slice(0, chatLimit || allChats.length);
    const selectedGroups = allGroups.slice(0, groupLimit || allGroups.length);
    const finalJids = [...selectedChats, ...selectedGroups].slice(0, SAFETY.MAX_JIDS);

    if (!finalJids.length)
      return await m.reply("❌ Invalid count. Try `.fwd 5 chats 5 groups` or `.fwd all`");

    await m.reply(`🚀 Forwarding to ${selectedChats.length} chats & ${selectedGroups.length} groups...`);

    // ===== PREPARE MESSAGE =====
    const q = m.quoted;
    const mtype = q.mtype;
    let content = {};

    if (
      ["imageMessage", "videoMessage", "audioMessage", "stickerMessage", "documentMessage"].includes(mtype)
    ) {
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

    // ===== SEND =====
    const tracker = JSON.parse(fs.readFileSync(TRACK_FILE));
    let success = 0;

    for (let i = 0; i < finalJids.length; i++) {
      const jid = finalJids[i];
      try {
        const sent = await conn.sendMessage(jid, content);
        tracker.push({ jid, msgId: sent.key.id });
        success++;
      } catch {}
      if ((i + 1) % 10 === 0)
        await m.reply(`📤 Progress: ${i + 1}/${finalJids.length}`);
      await new Promise(r => setTimeout(r, SAFETY.DELAY));
    }

    fs.writeFileSync(TRACK_FILE, JSON.stringify(tracker, null, 2));
    await m.reply(`✅ Forwarded to ${success}/${finalJids.length} chats/groups successfully!`);

  } catch (err) {
    console.error("Forward Error:", err);
    await m.reply("💢 Error: " + err.message);
  }
});
