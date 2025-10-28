// 💫 FORWARD ALL — Umar Farooq Edition (Ultimate Fix)
// Made with ❤️ by whiteshadow + Umar

const { cmd } = require("../command");
const fs = require("fs");

const TRACK_FILE = "./forward-tracker.json";

// Auto create tracker file
if (!fs.existsSync(TRACK_FILE)) fs.writeFileSync(TRACK_FILE, JSON.stringify([]));

const SAFETY = { MAX_JIDS: 1000, DELAY: 2000 };

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
  desc: "Forward messages to all chats or specific number of chats/groups.",
  category: "owner",
  filename: __filename
}, async (conn, m, match, { isOwner }) => {
  try {
    if (!isOwner) return await m.reply("⚠️ *Owner Only Command!*");

    // 🔒 Safely normalize input
    let input = "";
    if (typeof match === "string") input = match.trim();
    else if (Array.isArray(match)) input = match.join(" ").trim();
    else if (match && typeof match === "object" && match.text) input = match.text.trim();

    const args = input.split(/\s+/).filter(a => a && a.length);

    // 🧾 No arguments = show help
    if (!args.length) return await m.reply(HELP_MSG);

    // 🗑️ DELETE MODE
    if (args[0].toLowerCase() === "del" && args[1]?.toLowerCase() === "all") {
      const tracker = JSON.parse(fs.readFileSync(TRACK_FILE));
      if (!tracker.length) return await m.reply("⚠️ No forwarded messages to delete.");
      let deleted = 0;
      for (const x of tracker) {
        try {
          await conn.sendMessage(x.jid, { delete: { remoteJid: x.jid, fromMe: true, id: x.msgId } });
          deleted++;
        } catch {}
        await new Promise(r => setTimeout(r, 500));
      }
      fs.writeFileSync(TRACK_FILE, JSON.stringify([]));
      return await m.reply(`🗑️ Deleted ${deleted} forwarded messages.`);
    }

    // 📤 FORWARD MODE
    if (!m.quoted) return await m.reply("⚠️ Please reply to a message to forward.");

    // 🔍 Fetch chats + groups
    const contacts = Object.keys(conn.contacts || {});
    const groupsData = await conn.groupFetchAllParticipating().catch(() => ({}));
    const groupJids = Object.keys(groupsData);
    let allJids = [...new Set([...contacts, ...groupJids])]
      .filter(j => j.endsWith("@s.whatsapp.net") || j.endsWith("@g.us"));

    if (!allJids.length)
      return await m.reply("❌ No chats or groups found. Try messaging someone first!");

    // 🧮 Parse command
    let chatLimit = 0, groupLimit = 0, mode = "custom";
    if (args[0].toLowerCase() === "all") mode = "all";
    else {
      const chatIndex = args.indexOf("chats");
      const groupIndex = args.indexOf("groups");
      if (chatIndex > 0) chatLimit = parseInt(args[chatIndex - 1]) || 0;
      if (groupIndex > 0) groupLimit = parseInt(args[groupIndex - 1]) || 0;

      if (chatLimit === 0 && groupLimit === 0) return await m.reply(HELP_MSG);
    }

    // 🧩 Divide chats & groups
    const chats = allJids.filter(j => j.endsWith("@s.whatsapp.net"));
    const groups = allJids.filter(j => j.endsWith("@g.us"));
    const finalChats = mode === "all" ? chats : chats.slice(0, chatLimit);
    const finalGroups = mode === "all" ? groups : groups.slice(0, groupLimit);
    const sendList = [...finalChats, ...finalGroups].slice(0, SAFETY.MAX_JIDS);

    if (!sendList.length)
      return await m.reply("❌ No valid chats or groups to send.");

    await m.reply(`🚀 Forwarding to ${sendList.length} destinations (${finalChats.length} chats, ${finalGroups.length} groups)...`);

    // 🖼️ Prepare message
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
