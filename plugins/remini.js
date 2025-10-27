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

    // ⏳ React while processing
    await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

    // 🔹 Upload image to get direct URL
    const media = await quoted.download();
    const imageUrl = await uploadImage(media);

    // 🔹 Call Remini API
    const apiUrl = `https://api.id.dexter.it.com/imagecreator/remini?image=${encodeURIComponent(imageUrl)}`;
    const { data } = await axios.get(apiUrl, { timeout: 60000 });

    if (!data?.result?.url) {
      await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
      return reply("*❌ Failed to enhance image. Try again later!*");
    }

    // ✅ Send enhanced image
    await conn.sendMessage(from, {
      image: { url: data.result.url },
      caption: `✨ *Image Enhanced Successfully!*`
    }, { quoted: mek });

    await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

  } catch (err) {
    console.error("Remini API Error:", err);
    await conn.sendMessage(from, { react: { text: "⚠️", key: mek.key } });
    reply("*⚠️ Error enhancing image. Please try again later.*");
  }
});
