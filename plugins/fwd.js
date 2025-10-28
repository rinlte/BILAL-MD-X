// 💫 FORWARD ALL — Umar Farooq FINAL (Auto Chats + Groups Sync)

const { cmd } = require("../command");
const fs = require("fs");

const TRACK_FILE = "./forward-tracker.json";
if (!fs.existsSync(TRACK_FILE)) fs.writeFileSync(TRACK_FILE, JSON.stringify([]));

const SAFETY = { MAX_JIDS: 2000, DELAY: 2000 };

cmd({
  pattern: "forward",
  alias: ["fwd"],
  desc: "Forward replied message to chats & groups automatically",
  category: "owner",
  filename: __filename
}, async (conn, mek, m, { reply, isOwner, body }) => {
  try {
    if (!isOwner) return await reply("⚠️ *Owner Only Command!*");

    const fullBody = body || "";
    const input = fullBody.replace(/^[.!/]?(forward|fwd)\s*/i, "").trim();

    // 📘 Show help if no args
    if (!input) {
      return await reply(
        `⚙️ *Forward Command Help*\n\n📤 *Usage:*\n1. Reply to a message then type:\n   • .fwd all\n   • .fwd 5 chats 3 groups\n   • .fwd del all\n\n💡 *Examples:*\n> .fwd all\n> .fwd 5 chats 3 groups\n> .fwd del all`
      );
    }

    // 🗑 DELETE ALL
    if (/^del\s+all$/i.test(input)) {
      const tracker = JSON.parse(fs.readFileSync(TRACK_FILE));
      if (!tracker.length) return await reply("⚠️ No forwarded messages to delete.");

      let deleted = 0;
      for (const x of tracker) {
        try {
          await conn.sendMessage(x.jid, { delete: { remoteJid: x.jid, fromMe: true, id: x.msgId } });
          deleted++;
        } catch {}
        await new Promise(r => setTimeout(r, 300));
      }
      fs.writeFileSync(TRACK_FILE, JSON.stringify([]));
      return await reply(`🗑️ Deleted ${deleted} messages.`);
    }

    if (!m.quoted) return await reply("⚠️ Please reply to a message to forward.");

    // 🧮 Parse user input
    let chatLimit = 0, groupLimit = 0;
    if (/all/i.test(input)) {
      chatLimit = SAFETY.MAX_JIDS;
      groupLimit = SAFETY.MAX_JIDS;
    } else {
      const chatMatch = input.match(/(\d+)\s*chats?/i);
      const groupMatch = input.match(/(\d+)\s*groups?/i);
      if (chatMatch) chatLimit = parseInt(chatMatch[1]);
      if (groupMatch) groupLimit = parseInt(groupMatch[1]);
    }

    if (!chatLimit && !groupLimit)
      return await reply("⚠️ Example:\n`.fwd 5 chats 3 groups` ya `.fwd all`");

    // 🧠 Fetch all groups
    const groups = await conn.groupFetchAllParticipating().catch(() => ({}));
    const groupJids = Object.keys(groups);

    // 🧠 Fetch all chats (contacts from WhatsApp)
    let chatJids = [];
    try {
      // get all contacts (non-blocked)
      const contacts = Object.entries(conn.contacts || {})
        .filter(([jid, data]) => jid.endsWith("@s.whatsapp.net") && !data.blocked)
        .map(([jid]) => jid);

      // get from chats map (open conversations)
      const openChats = Object.keys(conn.chats || {}).filter(j => j.endsWith("@s.whatsapp.net"));

      // merge both
      chatJids = [...new Set([...contacts, ...openChats])];
    } catch (e) {
      console.log("⚠️ Chat fetch error:", e.message);
    }

    const selectedChats = chatJids.slice(0, chatLimit || chatJids.length);
    const selectedGroups = groupJids.slice(0, groupLimit || groupJids.length);
    const totalTargets = [...new Set([...selectedChats, ...selectedGroups])];

    if (!totalTargets.length)
      return await reply("❌ No chats or groups found. Try messaging someone first!");

    // 🧾 Prepare quoted message
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
    let sentChats = 0, sentGroups = 0;

    // 📨 Send to chats
    for (let jid of selectedChats) {
      try {
        const sent = await conn.sendMessage(jid, content);
        tracker.push({ jid, msgId: sent.key.id });
        sentChats++;
      } catch (e) {
        console.log("Chat send fail:", jid, e.message);
      }
      await new Promise(r => setTimeout(r, SAFETY.DELAY));
    }

    // 📨 Send to groups
    for (let jid of selectedGroups) {
      try {
        const sent = await conn.sendMessage(jid, content);
        tracker.push({ jid, msgId: sent.key.id });
        sentGroups++;
      } catch (e) {
        console.log("Group send fail:", jid, e.message);
      }
      await new Promise(r => setTimeout(r, SAFETY.DELAY));
    }

    fs.writeFileSync(TRACK_FILE, JSON.stringify(tracker, null, 2));

    await reply(
      `✅ *Forward Completed!*\n\n` +
      `📩 ${sentChats} chats me message forward ho gaya\n` +
      `👥 ${sentGroups} groups me message send ho gaya`
    );

  } catch (err) {
    console.error("Forward Error:", err);
    await reply("💢 Error: " + err.message);
  }
});
