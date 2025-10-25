const { cmd } = require('../command');
const axios = require('axios');
const FormData = require('form-data');

cmd({
  pattern: "hdr",
  react: "🪄",
  desc: "Enhance image using AI HDR (Remini Style)",
  category: "image",
  use: ".hdr (reply to an image)",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const quoted = m.quoted || m.quotedMessage || m.quotedMsg;
    const mime = quoted?.mimetype || quoted?.msg?.mimetype || '';

    if (!quoted || !/image/.test(mime)) {
      return reply(
        "*📸 HDR BANANA HAI?*\n\n" +
        "❗ Pehle koi image bhejo\n" +
        "👉 Us image pe reply karo likh kar `.hdr`\n\n" +
        "_Example:_\n`(reply to image)` → `.hdr`"
      );
    }

    await conn.sendMessage(from, { react: { text: "🔄", key: mek.key } });

    // 🖼️ Download the image
    const buffer = await quoted.download();
    if (!buffer) return reply("❌ Image download failed. Try again!");

    // 🧠 Real working Remini API (no API key required)
    const apiUrl = "https://aemt.me/remini";

    const form = new FormData();
    form.append("image", buffer, "input.jpg");

    const response = await axios.post(apiUrl, form, {
      headers: form.getHeaders(),
      responseType: "arraybuffer"
    });

    if (!response?.data || response.data.length < 10000) {
      await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
      return reply("*❌ Enhancement failed. Try a clearer image!*");
    }

    const enhanced = Buffer.from(response.data);

    await conn.sendMessage(from, {
      image: enhanced,
      caption: "*✨ HDR Image Enhanced Successfully!*\n> 🪄 by Bilal-MD"
    }, { quoted: m });

    await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

  } catch (err) {
    console.error("❌ HDR Command Error:", err.message);
    await conn.sendMessage(from, { react: { text: "💥", key: mek.key } });
    reply("*❌ Kuch galat ho gaya! Dobaara try karo 🥺*");
  }
});
