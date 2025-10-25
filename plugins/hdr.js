const { cmd } = require('../command');
const axios = require('axios');
const FormData = require('form-data');

cmd({
  pattern: "hdr",
  react: "🪄",
  desc: "Enhance replied image using free AI HDR service",
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

    // 🖼️ Download the replied image
    const buffer = await quoted.download();
    if (!buffer) return reply("❌ Image download failed. Try again!");

    // 🌐 Working free AI endpoint
    const apiUrl = "https://api.itsrose.rest/image/enhance"; // open endpoint, no key needed

    const form = new FormData();
    form.append("file", buffer, "photo.jpg");

    const response = await axios.post(apiUrl, form, {
      headers: form.getHeaders(),
      responseType: "arraybuffer",
    });

    if (!response?.data || response.data.length < 10000) {
      await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
      return reply("*❌ Enhancement failed. Try a clearer image!*");
    }

    const enhanced = Buffer.from(response.data);

    await conn.sendMessage(
      from,
      {
        image: enhanced,
        caption: "*✨ HDR Image Enhanced Successfully!*\n> 🪄 by Bilal-MD",
      },
      { quoted: m }
    );

    await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
  } catch (error) {
    console.error("❌ HDR Command Error:", error.message);
    await conn.sendMessage(from, { react: { text: "💥", key: mek.key } });
    reply("*❌ Kuch galat ho gaya! Dobaara try karo 🥺*");
  }
});
