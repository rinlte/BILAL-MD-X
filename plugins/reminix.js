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
    // ✅ Check if user replied to an image
    if (!quoted) {
      return reply("⚠️ *Aapne kisi photo par reply nahi kiya!* 📸\n\n👉 Kisi image ke reply me `.remini` likhe.");
    }

    const mime = quoted.mimetype || "";
    if (!/image/.test(mime)) {
      return reply("⚠️ *Yeh file image nahi hai!*\n\nKisi photo ke reply me `.remini` likhe.");
    }

    // ⏳ React during processing
    await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
    await reply("🧠 *AI se aapki photo enhance ki ja rahi hai... Thoda intezaar kare 💫*");

    // 📤 Upload image
    const media = await quoted.download();
    const imageUrl = await uploadImage(media);

    // 🌐 Call Remini API
    const apiUrl = `https://api.id.dexter.it.com/imagecreator/remini?image=${encodeURIComponent(imageUrl)}`;
    const { data } = await axios.get(apiUrl, { timeout: 90000 });

    // ❌ Check for valid response
    if (!data?.result?.url) {
      await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
      return reply(`❌ *Failed to enhance image.*\n\nServer Response: ${JSON.stringify(data, null, 2)}`);
    }

    // ✅ Send enhanced image
    await conn.sendMessage(from, {
      image: { url: data.result.url },
      caption: "✨ *Image Enhanced Successfully by AI!* 💫"
    }, { quoted: mek });

    await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

  } catch (err) {
    console.error("Remini API Error:", err);
    await conn.sendMessage(from, { react: { text: "⚠️", key: mek.key } });
    reply(`⚠️ *Error enhancing image:*\n\n\`\`\`${err.message}\`\`\``);
  }
});
