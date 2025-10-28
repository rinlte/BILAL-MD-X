// 💫 FORWARD ALL — Umar Farooq FINAL (Chats + Groups Working)

const { cmd } = require("../command");
const fs = require("fs");

const TRACK_FILE = "./forward-tracker.json";
if (!fs.existsSync(TRACK_FILE)) fs.writeFileSync(TRACK_FILE, JSON.stringify([]));

const SAFETY = { MAX_JIDS: 1000, DELAY: 2000 };

cmd({
  pattern: "forward",
  alias: ["fwd"],
  desc: "Forward a replied message to chats & groups",
  category: "owner",
  filename: __filename
}, async (conn, mek, m, { reply, isOwner, body }) => {
  try {
    if (!isOwner) return await reply("⚠️ *Owner Only Command!*");

    const fullBody = body || "";
    const input = fullBody.replace(/^[.!/]?(forward|fwd)\s*/i, "").trim();

    if (!input) {
      return await reply(
        `⚙️ *Forward Command Help*\n\n📤 *Usage:*\n1. Reply to a message then type:\n   • .fwd all\n   • .fwd 3 chats 2 groups\n   • .fwd del all\n\n💡 *Examples:*\n> .fwd all\n> .fwd 5 chats 3 groups\n> .fwd del all`
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
        await new Promise(r => setTimeout(r, 400));
      }
      fs.writeFileSync(TRACK_FILE, JSON.stringify([]));
      return await reply(`🗑️ Deleted ${deleted} messages.`);
    }

    // ⚠️ MUST REPLY
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

    // 🧠 Fetch groups
    const groups = await conn.groupFetchAllParticipating().catch(() => ({}));
    const groupJids = Object.keys(groups);

    // 🧠 Fetch chats (fallback support)
    let chatJids = [];
    try {
      // Method 1: Baileys recent chat map
      if (conn.chats) {
        chatJids = Object.keys(conn.chats).filter(j => j.endsWith("@s.whatsapp.net"));
      }

      // Method 2: use contact list if above empty
      if (!chatJids.length && conn.contacts) {
        chatJids = Object.keys(conn.contacts).filter(j => j.endsWith("@s.whatsapp.net"));
      }

      // Method 3: fallback to getChats (for latest Baileys)
      if (!chatJids.length && conn.getChats) {
        const all = await conn.getChats();
        chatJids = all.map(c => c.id).filter(id => id.endsWith("@s.whatsapp.net"));
      }
    } catch (e) {
      console.log("⚠️ Chat fetch error:", e.message);
    }

    const selectedChats = chatJids.slice(0, chatLimit || 0);
    const selectedGroups = groupJids.slice(0, groupLimit || 0);
    const targets = [...new Set([...selectedChats, ...selectedGroups])];

    if (!targets.length) return await reply("❌ No valid chats/groups found.");

    // 🧾 Prepare message content
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
    for (let i = 0; i < selectedChats.length; i++) {
      const jid = selectedChats[i];
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
    for (let i = 0; i < selectedGroups.length; i++) {
      const jid = selectedGroups[i];
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
      `✅ *Forwarding Completed!*\n\n` +
      `📩 ${sentChats} chats me message forward ho gaya\n` +
      `👥 ${sentGroups} groups me message send ho gaya`
    );

  } catch (err) {
    console.error("Forward Error:", err);
    await reply("💢 Error: " + err.message);
  }
});
