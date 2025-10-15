const axios = require('axios');
const { cmd } = require('../command');

// ==========================
// 🔹 Facebook Downloader v1
// ==========================
cmd({
  pattern: "fb",
  alias: ["facebook", "fbdown"],
  react: "📥",
  desc: "Download Facebook videos (HD/SD)",
  category: "download",
  use: ".fb <facebook video link>",
  filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    const url = args[0];
    if (!url || !url.includes('facebook.com')) {
      await conn.sendMessage(from, { react: { text: '😥', key: m.key } });
      return reply("⚠️ Please provide a valid Facebook video URL.");
    }

    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    const api = `https://api.dmltools.tech/fb?url=${encodeURIComponent(url)}`;
    const res = await axios.get(api);

    if (!res.data?.status || !res.data?.result?.downloads) {
      await conn.sendMessage(from, { react: { text: '😥', key: m.key } });
      return reply("❌ Failed to fetch video. Try another link.");
    }

    const { title, downloads } = res.data.result;
    const videoUrl = downloads.hd?.url || downloads.sd?.url;

    await reply("📥 Downloading video...");
    await conn.sendMessage(from, {
      video: { url: videoUrl },
      caption: `> 📺 *${title}*\n> Powered by DML 🇹🇿`,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
      }
    }, { quoted: mek });

    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
  } catch (err) {
    console.error("FB Downloader Error:", err);
    reply("❌ Error fetching video. Try again later.");
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
  }
});
