const { cmd } = require('../command');
const axios = require('axios');
const FormData = require('form-data');

cmd({
  pattern: "hdr",
  react: "🪄",
  desc: "Enhance replied image using custom AI HDR (Remini Style)",
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

    // 🖼️ Download image
    const buffer = await quoted.download();
    if (!buffer) return reply("❌ Image download failed, try again.");

    // ⚙️ Custom AI HDR enhancer (no key)
    const apiUrl = "https://api-inference.huggingface.co/models/caidas/swin2sr-classical-sr-x2-64";

    const form = new FormData();
    form.append("inputs", buffer, "input.jpg");

    const response = await axios.post(apiUrl, form, {
      headers: {
        Authorization: "Bearer hf_sJtRzexampleAPIKEYfree", // free-tier token
        ...form.getHeaders(),
      },
      responseType: "arraybuffer",
    });

    const enhanced = Buffer.from(response.data);

    // 🖼️ Send enhanced image
    await conn.sendMessage(from, {
      image: enhanced,
      caption: "*✨ HDR Enhanced Successfully!*\n> 🪄 by Bilal-MD",
    }, { quoted: m });

    await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

  } catch (error) {
    console.error("❌ HDR Command Error:", error.message);
    await conn.sendMessage(from, { react: { text: "💥", key: mek.key } });
    reply("*❌ Kuch galat ho gaya! Dobaara try karo 🥺*");
  }
});
