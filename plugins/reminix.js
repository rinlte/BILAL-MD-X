const { cmd } = require("../command");
const axios = require("axios");
const uploadImage = require("../lib/uploadImage.js");

cmd({
  pattern: "reminix",
  alias: ["enhance", "hdphoto", "clearphoto"],
  desc: "Enhance any image using AI (Remini)",
  category: "tools",
  react: "😇",
  filename: __filename
}, async (conn, mek, m, { from, reply, quoted }) => {
  try {
    await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });
    await reply("✅ Command triggered successfully!");

    const mime = quoted?.mimetype || "";
    if (!/image/.test(mime)) {
      return reply("📸 *Reply kisi image par kare jise enhance karna hai!*");
    }

    await reply("📥 Downloading image...");
    const media = await quoted.download();
    if (!media) throw new Error("Media download failed!");

    await reply("☁️ Uploading image...");
    const imageUrl = await uploadImage(media);
    if (!imageUrl) throw new Error("Upload failed – no image URL found!");

    await reply(`🌐 Upload successful!\nURL: ${imageUrl}`);

    // ✅ Test API endpoint directly
    const apiUrl = `https://api.id.dexter.it.com/imagecreator/remini?image=${encodeURIComponent(imageUrl)}`;
    await reply(`🚀 Calling API:\n${apiUrl}`);

    const { data } = await axios.get(apiUrl, { timeout: 60000 });

    await reply("📦 API response received!");

    if (!data?.result?.url) {
      throw new Error("API didn’t return a valid image URL!");
    }

    await conn.sendMessage(from, {
      image: { url: data.result.url },
      caption: `✨ *Image Enhanced Successfully!*`
    }, { quoted: mek });

    await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    await reply("✅ *Process complete!*");

  } catch (err) {
    console.error("Remini Error:", err);
    await conn.sendMessage(from, { react: { text: "⚠️", key: mek.key } });
    reply(`⚠️ *Error:* \`\`\`${err?.message || err}\`\`\``);
  }
});
