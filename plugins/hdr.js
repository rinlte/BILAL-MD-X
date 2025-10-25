const { cmd } = require('../command');
const axios = require('axios');
const FormData = require('form-data');

cmd({
  pattern: "hdr",
  react: "🪄",
  desc: "Enhance replied image using AI HDR (Remini Style)",
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

    // 🖼️ Image download
    const buffer = await quoted.download();
    if (!buffer) return reply("❌ Image download failed, try again.");

    // 🌐 New working AI HDR API (no key required)
    const apiUrl = "https://api.neoxr.eu/api/ai-enhance?apikey=freeapi";

    const form = new FormData();
    form.append("image", buffer, "image.jpg");

    const { data } = await axios.post(apiUrl, form, {
      headers: form.getHeaders(),
      responseType: "json"
    });

    if (!data.status || !data.result?.image) {
      await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
      return reply("*❌ Enhancement failed. Try a clearer image!*");
    }

    // 📤 Send enhanced image
    await conn.sendMessage(from, {
      image: { url: data.result.image },
      caption: "*✨ HDR Image Enhanced Successfully!*\n> 🪄 by Bilal-MD"
    }, { quoted: m });

    await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

  } catch (error) {
    console.error("❌ HDR Command Error:", error?.response?.data || error.message);
    await conn.sendMessage(from, { react: { text: "💥", key: mek.key } });
    reply("*❌ Kuch galat ho gaya! Dobaara try karo 🥺*");
  }
});
