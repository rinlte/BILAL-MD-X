// 💫 FORWARD ALL — Umar Farooq Edition (Final Fixed)
// Made with ❤️ by whiteshadow + Umar

const { cmd } = require("../command");
const fs = require("fs");

const TRACK_FILE = "./forward-tracker.json";

// Auto create tracker file if missing
if (!fs.existsSync(TRACK_FILE)) fs.writeFileSync(TRACK_FILE, JSON.stringify([]));

const SAFETY = {
  MAX_JIDS: 1000, // you can increase if needed
  DELAY: 2000,
};

cmd({
  pattern: "forward",
  alias: ["fwd"],
  desc: "Forward a replied message to all chats & groups.",
  category: "owner",
  filename: __filename
}, async (conn, m, match, { isOwner }) => {
  try {
    if (!isOwner) return await m.reply("⚠️ *Owner Only Command!*");

    let args = (typeof match === "string" ? match.trim().split(/\s+/) : []);

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
      return await m.reply(`🗑️ Deleted ${deleted} messages.`);
    }

    // ===== FORWARD MODE =====
    if (!m.quoted) return await m.reply("⚠️ Please reply to a message to forward.");

    // 🧠 Auto Fetch All Chats + Groups
    let allJids = [];

    // First try conn.chats
    if (conn.chats && Object.keys(conn.chats).length > 0) {
      allJids = Object.keys(conn.chats);
    }

    // Fallback: Fetch from contacts & group metadata
    if (allJids.length === 0) {
      const contacts = Object.keys(conn.contacts || {});
      const groups = await conn.groupFetchAllParticipating().catch(() => ({}));
      const groupJids = Object.keys(groups);
      allJids = [...new Set([...contacts, ...groupJids])];
    }

    // Filter only valid jids
    allJids = allJids.filter(jid =>
      jid.endsWith("@s.whatsapp.net") || jid.endsWith("@g.us")
    );

    if (allJids.length === 0)
      return await m.reply("❌ Still no chats or groups found. Try messaging someone first!");

    const limited = allJids.slice(0, SAFETY.MAX_JIDS);
    await m.reply(`🚀 Forwarding to ${limited.length} chats & groups...`);

    // ===== Prepare Message =====
    const q = m.quoted;
    const mtype = q.mtype;
    let content = {};

    if (
      ["imageMessage", "videoMessage", "audioMessage", "stickerMessage", "documentMessage"].includes(mtype)
    ) {
      const buffer = await q.download();
      switch (mtype) {
        case "imageMessage":
          content = { image: buffer, caption: q.text || "" };
          break;
        case "videoMessage":
          content = { video: buffer, caption: q.text || "" };
          break;
        case "audioMessage":
          content = { audio: buffer, ptt: q.ptt || false };
          break;
        case "stickerMessage":
          content = { sticker: buffer };
          break;
        case "documentMessage":
          content = { document: buffer, fileName: q.fileName || "file" };
          break;
      }
    } else {
      content = { text: q.text || q.caption || " " };
    }

    const tracker = JSON.parse(fs.readFileSync(TRACK_FILE));
    let success = 0;

    for (let i = 0; i < limited.length; i++) {
      const jid = limited[i];
      try {
        const sent = await conn.sendMessage(jid, content);
        tracker.push({ jid, msgId: sent.key.id });
        success++;
      } catch (e) {}
      if ((i + 1) % 20 === 0)
        await m.reply(`📤 Progress: ${i + 1}/${limited.length}`);
      await new Promise(r => setTimeout(r, SAFETY.DELAY));
    }

    fs.writeFileSync(TRACK_FILE, JSON.stringify(tracker, null, 2));

    await m.reply(`✅ Forwarded to *${success}/${limited.length}* chats/groups successfully!`);

  } catch (err) {
    console.error("Forward Error:", err);
    await m.reply("💢 Error: " + err.message);
  }
});
