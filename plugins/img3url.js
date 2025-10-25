const { cmd } = require('../command');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

cmd({
  pattern: "url",
  react: "🔗",
  desc: "Upload media to Telegraph and get a permanent link",
  category: "tools",
  filename: __filename
}, async (conn, mek, store, { from, quoted, mime, reply }) => {
  try {
    const q = quoted || mek;
    const mimeType =
      (q.msg || q.message)?.mimetype ||
      (q.message?.imageMessage ? "image/jpeg" : q.message?.videoMessage ? "video/mp4" : null);

    if (!mimeType)
      return reply("📸 *Pehle koi image ya video bhejo, fir uspe reply karo likh ke `.url`*");

    // 🪄 Reaction while processing
    await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

    const buffer = await q.download();
    const ext = mimeType.split("/")[1];
    const tmpFile = path.join(__dirname, `temp_${Date.now()}.${ext}`);
    fs.writeFileSync(tmpFile, buffer);

    // Upload to Telegraph
    const form = new FormData();
    form.append("file", fs.createReadStream(tmpFile));

    const res = await axios.post("https://telegra.ph/upload", form, {
      headers: form.getHeaders(),
    });

    fs.unlinkSync(tmpFile);

    if (!res.data || !res.data[0]?.src)
      return reply("❌ Upload failed! Please try again.");

    const link = "https://telegra.ph" + res.data[0].src;

    await conn.sendMessage(
      from,
      {
        text: `✅ *Telegraph Link Ban Gaya!*\n\n🔗 ${link}\n\n> Permanent & Fast Hosting 😎`,
      },
      { quoted: mek }
    );

    await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
  } catch (e) {
    console.error("Telegraph Upload Error:", e);
    reply("❌ Kuch galat ho gaya! Dobaara try karo 🥺");
  }
});
