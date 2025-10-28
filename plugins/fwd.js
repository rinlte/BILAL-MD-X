// jawad tech
// edited whiteshadow + Umar Edition 💀

const { cmd } = require("../command");
const fs = require("fs");

// File to track forwarded messages for deletion
const TRACK_FILE = "./forward-tracker.json";

// Ensure tracker exists
if (!fs.existsSync(TRACK_FILE)) fs.writeFileSync(TRACK_FILE, JSON.stringify([]));

const SAFETY = {
  MAX_JIDS: 30,
  BASE_DELAY: 2000,
  EXTRA_DELAY: 4000,
};

cmd({
  pattern: "forward",
  alias: ["fwd"],
  desc: "Bulk forward or delete forwarded messages",
  category: "owner",
  filename: __filename
}, async (client, message, match, { isOwner }) => {
  try {
    if (!isOwner) return await message.reply("*📛 Owner Only Command*");

    const args = (match || "").trim().split(/\s+/);

    // =========================
    // 🔹 DELETE MODE
    // =========================
    if (args[0] === "del" && args[1] === "all") {
      const history = JSON.parse(fs.readFileSync(TRACK_FILE));
      if (!history.length) return await message.reply("⚠️ No forwarded messages found to delete.");

      let deleted = 0;
      for (const h of history) {
        try {
          await client.sendMessage(h.jid, { delete: { remoteJid: h.jid, fromMe: true, id: h.msgId } });
          deleted++;
          await new Promise(r => setTimeout(r, 500));
        } catch {}
      }

      fs.writeFileSync(TRACK_FILE, JSON.stringify([]));
      return await message.reply(`🗑️ Deleted ${deleted} forwarded messages.`);
    }

    // =========================
    // 🔹 FORWARD MODE
    // =========================
    if (!message.quoted) return await message.reply("*🍁 Please reply to a message to forward.*");

    let targets = [];

    // -------- fwd all -----------
    if (args[0] === "all") {
      const chats = Object.keys(client.chats || {});
      targets = chats.filter(j => j.endsWith("@s.whatsapp.net") || j.endsWith("@g.us"));
      await message.reply(`🚀 Forwarding to *${targets.length}* chats/groups...`);
    } 
    // -------- manual numbers / jids ----------
    else {
      const raw = args.join(" ").split(/[\s,]+/).filter(Boolean);
      targets = raw.map(id => {
        id = id.replace(/[@\s]/g, "").replace(/[^0-9+]/g, "");
        if (id.startsWith("+")) id = id.slice(1);
        if (/^\d+$/.test(id)) {
          if (id.length > 11) return `${id}@g.us`; // group id
          else return `${id}@s.whatsapp.net`; // normal number
        }
        return null;
      }).filter(Boolean);
    }

    // Safety limit
    targets = targets.slice(0, SAFETY.MAX_JIDS);
    if (!targets.length) return await message.reply("❌ No valid numbers or groups found.");

    // ----- Media/Text handling -----
    const q = message.quoted;
    const mtype = q.mtype;
    let content = {};

    if (["imageMessage", "videoMessage", "audioMessage", "stickerMessage", "documentMessage"].includes(mtype)) {
      const buffer = await q.download();
      switch (mtype) {
        case "imageMessage":
          content = { image: buffer, caption: q.text || "" }; break;
        case "videoMessage":
          content = { video: buffer, caption: q.text || "" }; break;
        case "audioMessage":
          content = { audio: buffer, ptt: q.ptt || false }; break;
        case "stickerMessage":
          content = { sticker: buffer }; break;
        case "documentMessage":
          content = { document: buffer, fileName: q.fileName || "file" }; break;
      }
    } else {
      content = { text: q.text || q.caption || " " };
    }

    // ----- Forwarding -----
    const tracker = JSON.parse(fs.readFileSync(TRACK_FILE));
    let success = 0, failed = [];

    for (const [i, jid] of targets.entries()) {
      try {
        const sent = await client.sendMessage(jid, content);
        success++;
        tracker.push({ jid, msgId: sent.key.id });
      } catch {
        failed.push(jid);
      }
      await new Promise(r => setTimeout(r, SAFETY.BASE_DELAY));
    }

    fs.writeFileSync(TRACK_FILE, JSON.stringify(tracker, null, 2));

    let msg = `✅ *Forward Complete*\n\n📤 Success: ${success}/${targets.length}`;
    if (failed.length) msg += `\n❌ Failed: ${failed.length}`;
    if (args[0] === "all") msg += `\n🌐 Mode: Forwarded to all chats`;

    await message.reply(msg);

  } catch (err) {
    console.error(err);
    await message.reply("💢 Error: " + err.message);
  }
});
