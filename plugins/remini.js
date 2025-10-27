const { cmd } = require("../command");
const axios = require("axios");
const uploadImage = require("../lib/uploadImage.js");

cmd({
  pattern: "remini",
  alias: ["enhance", "hdphoto", "clearphoto"],
  desc: "Enhance any image using AI (Remini)",
  category: "tools",
  react: "😇",
  filename: __filename
}, async (conn, mek, m, { from, reply, quoted }) => {
  try {
    const mime = (quoted?.mimetype || "");
    if (!/image/.test(mime)) {
      return reply("*📸 Reply kisi image par kare jise enhance karna hai!*");
    }

    await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
    reply("🔄 *Processing your image...*");

    // 📤 Upload image
    const media = await quoted.download().catch(err => {
      throw new Error("Image download failed: " + err.message);
    });

    const imageUrl = await uploadImage(media).catch(err => {
      throw new Error("Image upload failed: " + err.message);
    });

    if (!imageUrl) throw new Error("Image URL not found after upload.");

    reply("🌐 *Calling Remini API...*");

    // 🌐 API Call
    const apiUrl = `https://api.id.dexter.it.com/imagecreator/remini?image=${encodeURIComponent(imageUrl)}`;
    const { data } = await axios.get(apiUrl, { timeout: 60000 });

    if (!data?.result?.url) {
      throw new Error("API didn't return a valid image URL.");
    }

    // ✅ Send enhanced image
    await conn.sendMessage(from, {
      image: { url: data.result.url },
      caption: `✨ *Image Enhanced Successfully!*`
    }, { quoted: mek });

    await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

  } catch (err) {
    await conn.sendMessage(from, { react: { text: "⚠️", key: mek.key } });
    let errorMsg = err?.response?.data?.message || err?.message || String(err);
    reply(`⚠️ *Remini Command Error:*\n\n\`\`\`${errorMsg}\`\`\``);
  }
});
