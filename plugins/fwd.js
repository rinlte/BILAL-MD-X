// 💫 FORWARD ALL — Umar Farooq v3 (Auto Chats + Group Sync Fixed)

const { cmd } = require("../command");
const fs = require("fs");

const TRACK_FILE = "./forward-tracker.json";
if (!fs.existsSync(TRACK_FILE)) fs.writeFileSync(TRACK_FILE, JSON.stringify([]));

const SAFETY = { MAX_JIDS: 2000, DELAY: 2000 };

cmd({
  pattern: "forward",
  alias: ["fwd"],
  desc: "Forward replied message to all or selected chats/groups.",
  category: "owner",
  filename: __filename
}, async (conn, mek, m, { reply, isOwner, body }) => {
  try {
    if (!isOwner) return await reply("⚠️ *Owner Only Command!*");

    const fullBody = body || "";
    const input = fullBody.replace(/^[.!/]?(forward|fwd)\s*/i, "").trim();

    // 🧭 Help Message
    if (!input) {
      return await reply(
        `⚙️ *Forward Command Help*\n\n📤 *Usage:*\n• .fwd all\n• .fwd 5 chats 3 groups\n• .fwd del all\n\n💡 *Examples:*\n> .fwd all\n> .fwd 10 chats 5 groups\n> .fwd del all`
      );
    }

    // 🗑 Delete All
    if (/^del\s+all$/i.test(input)) {
      const tracker = JSON.parse(fs.readFileSync(TRACK_FILE));
      if (!tracker.length) return await reply("⚠️ No forwarded messages to delete.");

      let deleted = 0;
      for (const x of tracker) {
        try {
          await conn.sendMessage(x.jid, { delete: { remoteJid: x.jid, fromMe: true, id: x.msgId } });
          deleted++;
        } catch {}
        await new Promise(r => setTimeout(r, 200));
      }
      fs.writeFileSync(TRACK_FILE, JSON.stringify([]));
      return await reply(`🗑️ Deleted ${deleted} messages.`);
    }

    // ⚠️ Must Reply
    if (!m.quoted) return await reply("⚠️ Please reply to a message to forward.");

    // 🎯 Parse user input
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

    // 🧠 Fetch All Groups
    let groupJids = [];
    try {
      const groups = await conn.groupFetchAllParticipating().catch(() => ({}));
      groupJids = Object.keys(groups || {});
    } catch (e) {
      console.log("Group fetch error:", e.message);
    }

    // 🧠 Fetch Chats (contacts + opened chats)
    let chatJids = [];
    try {
      // Step 1: load all saved contacts
      const contacts = Object.keys(conn.contacts || {}).filter(j => j.endsWith("@s.whatsapp.net"));

      // Step 2: load all opened chats
      const openedChats = Object.keys(conn.chats || {}).filter(j => j.endsWith("@s.whatsapp.net"));

      // Step 3: merge both
      chatJids = [...new Set([...contacts, ...openedChats])];

      // Step 4: fallback — if still empty, fetch from conn.onWhatsApp()
      if (chatJids.length === 0) {
        const numbers = ["923001234567", "923451234567"]; // optional fallback
        const exists = await conn.onWhatsApp(numbers);
        chatJids = exists.filter(x => x.exists).map(x => x.jid);
      }
    } catch (e) {
      console.log("Chat fetch error:", e.message);
    }

    if (!chatJids.length && !groupJids.length)
      return await reply("❌ No chats or groups found! Try messaging someone first.");

    const selectedChats = chatJids.slice(0, chatLimit || chatJids.length);
    const selectedGroups = groupJids.slice(0, groupLimit || groupJids.length);
    const targets = [...new Set([...selectedChats, ...selectedGroups])];

    if (!targets.length) return await reply("❌ No valid JIDs found.");

    await reply(`🚀 Forwarding started!\n\n📩 ${selectedChats.length} chats\n👥 ${selectedGroups.length} groups`);

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

    // 📨 Send to Chats
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

    // 📨 Send to Groups
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
