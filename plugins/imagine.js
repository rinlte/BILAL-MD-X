const axios = require('axios');
const { cmd } = require('../command');

cmd({
  pattern: "imagine",
  alias: ["aiphoto", "aiimg", "aiimage"],
  desc: "Generate AI image from prompt",
  category: "ai",
  react: "🎨",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q) return reply("❌ *Please provide a prompt!*\nExample: `.aiimg futuristic city at night`");

    // ⏳ React while generating
    await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

    // 🖼️ Image API
    const res = await axios.get(`https://api.dreaded.site/api/imagine?prompt=${encodeURIComponent(q)}`);

    if (res.data?.result) {
      await conn.sendMessage(from, {
        image: { url: res.data.result },
        caption: `🖼️ *AI Generated Image*\n\n💬 *Prompt:* ${q}\n⚡ *Powered by BILAL-MD*`
      }, { quoted: m });

      await conn.sendMessage(from, { react: { text: "✅", key: m.key } });
    } else {
      throw new Error("Image not returned");
    }

  } catch (err) {
    console.error("AI Image Error:", err);
    await conn.sendMessage(from, { text: "❌ *Failed to generate image.* Try again later." }, { quoted: m });
    await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
  }
});
