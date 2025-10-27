const { cmd } = require("../command");
const axios = require("axios");
const uploadImage = require("../lib/uploadImage.js");

cmd({
  pattern: "remx",
  alias: ["enhance", "hdphoto", "clearphoto"],
  desc: "Enhance any image using AI (Remini)",
  category: "tools",
  react: "😇",
  filename: __filename
}, async (conn, mek, m, { from, reply, quoted }) => {
  try {
    console.log("🟢 Command started.");
    await reply("🟢 Step 1: Command triggered successfully!");

    // ✅ Step 1: Check reply
    if (!quoted) {
      console.log("⚠️ No image reply found.");
      return reply("⚠️ *Aapne kisi photo par reply nahi kiya!* 📸\n\n👉 Kisi image ke reply me `.remini` likhe.");
    }

    await reply("✅ Step 2: Image reply detected!");

    const mime = quoted.mimetype || "";
    if (!/image/.test(mime)) {
      console.log("⚠️ Replied message is not an image.");
      return reply("⚠️ *Yeh file image nahi hai!*");
    }

    await reply("✅ Step 3: Image confirmed, downloading...");

    // ⏳ React while processing
    await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

    // 📥 Step 4: Download image
    const media = await quoted.download();
    if (!media) {
      console.log("❌ Media download failed!");
      return reply("❌ *Image download nahi ho payi!*");
    }
    await reply("✅ Step 4: Image downloaded successfully!");

    // 📤 Step 5: Upload to get direct URL
    const imageUrl = await uploadImage(media);
    console.log("🖼️ Uploaded Image URL:", imageUrl);
    await reply("✅ Step 5: Image uploaded successfully!");

    if (!imageUrl) {
      console.log("❌ Upload failed.");
      return reply("❌ *Image upload failed. URL not received.*");
    }

    // 🌐 Step 6: Call Remini API
    const apiUrl = `https://api.id.dexter.it.com/imagecreator/remini?image=${encodeURIComponent(imageUrl)}`;
    console.log("🌐 API URL:", apiUrl);
    await reply("🚀 Step 6: Sending image to Remini API...");

    const { data } = await axios.get(apiUrl, { timeout: 90000 });
    console.log("📦 API Response:", data);

    if (!data?.result?.url) {
      console.log("❌ No enhanced image found in API response.");
      return reply(`❌ *Failed to enhance image.*\n\nResponse: ${JSON.stringify(data, null, 2)}`);
    }

    await reply("✅ Step 7: Got enhanced image from API!");

    // 🖼️ Step 8: Send enhanced image back
    await conn.sendMessage(from, {
      image: { url: data.result.url },
      caption: "✨ *Image Enhanced Successfully by AI!* 💫"
    }, { quoted: mek });

    await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
    await reply("🎉 Step 8: Image sent successfully!");

    console.log("✅ All steps completed successfully.");

  } catch (err) {
    console.error("❌ Error caught:", err);
    await conn.sendMessage(from, { react: { text: "⚠️", key: mek.key } });
    reply(`⚠️ *Error Occurred!*\n\n\`\`\`${err.message}\`\`\``);
  }
});
