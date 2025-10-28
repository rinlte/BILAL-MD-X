// 💫 FORWARD ALL — Umar Farooq Final Ready Version
// Made with ❤️ by WhiteShadow + Umar Farooq

const { cmd } = require("../command");
const fs = require("fs");

const TRACK_FILE = "./forward-tracker.json";
if (!fs.existsSync(TRACK_FILE)) fs.writeFileSync(TRACK_FILE, JSON.stringify([]));

const SAFETY = { MAX_JIDS: 1000, DELAY: 2000 };

cmd({
  pattern: "forward",
  alias: ["fwd"],
  desc: "Forward a replied message to all or selected chats/groups",
  category: "owner",
  filename: __filename
}, async (conn, mek, m, { reply, isOwner, body }) => {
  try {
    if (!isOwner) return await reply("⚠️ *Owner Only Command!*");

    // 🧠 Get full command text
    const fullBody = body || "";
    const input = fullBody.replace(/^[.!/]?(forward|fwd)\s*/i, "").trim();

    // 🧭 HELP — only when nothing written
    if (!input) {
      return await reply(
        `⚙️ *Forward Command Help*\n\n📤 *Usage:*\n1. Reply to a message then type:\n   • .fwd all → Send to *all chats & groups*\n   • .fwd 5 chats 3 groups → Send to limited chats/groups\n   • .fwd del all → Delete all forwarded messages\n\n💡 *Examples:*\n> .fwd all\n> .fwd 10 chats 5 groups\n> .fwd del all`
      );
    }

    // 🗑 DELETE MODE
    if (/^del\s+all$/i.test(input)) {
      const tracker = JSON.parse(fs.readFileSync(TRACK_FILE));
      if (!tracker.length) return await reply("⚠️ No forwarded messages to delete.");

      let deleted = 0;
      for (const x of tracker) {
        try {
          await conn.sendMessage(x.jid, {
            delete: { remoteJid: x.jid, fromMe: true, id: x.msgId }
          });
          deleted++;
        } catch {}
        await new Promise(r => setTimeout(r, 400));
      }
      fs.writeFileSync(TRACK_FILE, JSON.stringify([]));
      return await reply(`🗑️ Deleted ${deleted} messages.`);
    }

    // ⚠️ Must reply to a message
    if (!m.quoted) return await reply("⚠️ Please reply to a message to forward.");

    // 🧮 Parse input for limits
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
      return await reply("⚠️ Invalid format! Example:\n`.fwd 5 chats 3 groups` or `.fwd all`");

    // 🧠 Fetch all chats and groups
    const allChats = Object.keys(conn.chats || {});
    const groups = await conn.groupFetchAllParticipating().catch(() => ({}));
    const groupJids = Object.keys(groups);
    const chatJids = allChats.filter(j => j.endsWith("@s.whatsapp.net"));

    const selectedChats = chatJids.slice(0, chatLimit || chatJids.length);
    const selectedGroups = groupJids.slice(0, groupLimit || groupJids.length);
    const targets = [...new Set([...selectedChats, ...selectedGroups])];

    if (!targets.length)
      return await reply("❌ No valid chats or groups found. Try messaging someone first!");

    await reply(`🚀 Forwarding to *${targets.length}* chats/groups...`);

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
    let success = 0;

    for (let i = 0; i < targets.length; i++) {
      const jid = targets[i];
      try {
        const sent = await conn.sendMessage(jid, content);
        tracker.push({ jid, msgId: sent.key.id });
        success++;
      } catch {}
      if ((i + 1) % 20 === 0)
        await reply(`📤 Progress: ${i + 1}/${targets.length}`);
      await new Promise(r => setTimeout(r, SAFETY.DELAY));
    }

    fs.writeFileSync(TRACK_FILE, JSON.stringify(tracker, null, 2));
    await reply(`✅ Forwarded to *${success}/${targets.length}* chats/groups successfully!`);

  } catch (err) {
    console.error("Forward Error:", err);
    await reply("💢 Error: " + err.message);
  }
});
