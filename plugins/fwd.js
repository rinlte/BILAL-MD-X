// ⚡ Forward Everything Script — Umar Farooq Edition
// by whiteshadow + Umar Final Version

const { cmd } = require("../command");
const fs = require("fs");

const TRACK_FILE = "./forward-tracker.json";

// Auto create tracker file if missing
if (!fs.existsSync(TRACK_FILE)) {
  fs.writeFileSync(TRACK_FILE, JSON.stringify([]));
}

const SAFETY = {
  MAX_JIDS: 500, // limit increased for "all"
  DELAY: 2000,
};

cmd({
  pattern: "forward",
  alias: ["fwd"],
  desc: "Forward any replied message to all chats, groups, or delete history.",
  category: "owner",
  filename: __filename,
}, async (conn, m, match, { isOwner }) => {
  try {
    if (!isOwner) return await m.reply("⚠️ *Owner Only Command!*");

    let args = [];
    if (typeof match === "string") args = match.trim().split(/\s+/);
    else args = [];

    // ===================== 🔹 DELETE MODE =====================
    if (args[0] === "del" && args[1] === "all") {
      const history = JSON.parse(fs.readFileSync(TRACK_FILE));
      if (!history.length)
        return await m.reply("⚠️ No forwarded messages to delete.");

      let deleted = 0;
      for (const h of history) {
        try {
          await conn.sendMessage(h.jid, {
            delete: { remoteJid: h.jid, fromMe: true, id: h.msgId },
          });
          deleted++;
        } catch {}
        await new Promise((r) => setTimeout(r, 500));
      }

      fs.writeFileSync(TRACK_FILE, JSON.stringify([]));
      return await m.reply(`🗑️ Deleted ${deleted} forwarded messages.`);
    }

    // ===================== 🔹 FORWARD MODE =====================
    if (!m.quoted)
      return await m.reply("⚠️ Please *reply* to a message to forward.");

    // --- get all chats + groups ---
    const chats = Object.keys(conn.chats || {});
    const allJids = chats.filter(
      (jid) => jid.endsWith("@s.whatsapp.net") || jid.endsWith("@g.us")
    );

    if (!allJids.length)
      return await m.reply("❌ No chats or groups found to forward.");

    const limited = allJids.slice(0, SAFETY.MAX_JIDS);
    await m.reply(`🚀 Forwarding to ${limited.length} chats & groups...`);

    // prepare message
    const q = m.quoted;
    const mtype = q.mtype;
    let content = {};

    if (
      ["imageMessage", "videoMessage", "audioMessage", "stickerMessage", "documentMessage"].includes(
        mtype
      )
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
      if ((i + 1) % 10 === 0)
        await m.reply(`📤 Progress: ${i + 1}/${limited.length}`);
      await new Promise((r) => setTimeout(r, SAFETY.DELAY));
    }

    fs.writeFileSync(TRACK_FILE, JSON.stringify(tracker, null, 2));

    await m.reply(`✅ Forwarded to *${success}/${limited.length}* chats/groups successfully!`);

  } catch (err) {
    console.error(err);
    await m.reply("💢 Error: " + err.message);
  }
});
