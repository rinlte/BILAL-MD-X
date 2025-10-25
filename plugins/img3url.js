const { cmd } = require('../command');
const uploadImage = require('../lib/uploadImage'); // Ensure your bot already has this helper
const axios = require('axios');
const FormData = require('form-data');

cmd({
  pattern: "img3url",
  react: "🌐",
  desc: "Upload image to Telegraph (Permanent Link)",
  category: "tools",
  use: ".url (reply to image)",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const quoted = m.quoted || m.quotedMessage || m.quotedMsg;
    const mime = quoted?.mimetype || quoted?.msg?.mimetype || '';

    if (!quoted || !/image/.test(mime)) {
      return reply(
        "*🖼️ TELEGRAPH URL BANANA HAI?*\n\n" +
        "❗ Pehle koi *image* bhejo\n" +
        "👉 Uspe reply karo likh kar `.url`\n\n" +
        "_Example:_\n`(reply to image)` → `.url`"
      );
    }

    await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

    const buffer = await quoted.download();
    if (!buffer) return reply("❌ Media download failed. Try again!");

    // 🖼️ Upload to Telegraph
    const form = new FormData();
    form.append("file", buffer, "image.jpg");

    const res = await axios.post("https://telegra.ph/upload", form, {
      headers: form.getHeaders(),
    });

    if (Array.isArray(res.data) && res.data[0]?.src) {
      const imageUrl = "https://telegra.ph" + res.data[0].src;
      await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
      reply(
        `*🌐 Uploaded Successfully!*\n\n` +
        `🔗 *Telegraph URL:* ${imageUrl}\n` +
        `♾️ *Never expires*\n\n` +
        `_👑 BY: BILAL-MD 👑_`
      );
    } else {
      reply("*❌ Upload failed! Please try again later.*");
    }

  } catch (err) {
    console.error("Telegraph Upload Error:", err);
    await conn.sendMessage(from, { react: { text: "💥", key: mek.key } });
    reply("*❌ Kuch galat ho gaya! Dobaara try karo 🥺*");
  }
});
