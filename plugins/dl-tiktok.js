const { cmd } = require('../command');
const axios = require('axios');

cmd({
  pattern: "tiktok",
  alias: ["ttdl", "tt", "tiktokdl"],
  desc: "Download TikTok video without watermark",
  category: "downloader",
  react: "🎵",
  filename: __filename
}, async (conn, mek, m, { from, args, q, reply }) => {
  try {
    if (!q) return reply("*KISI BHI TIKTOK VIDEO KA LINK COPY KAR LO AUR ESE LIKHO ☺️❤️* \n\n\n *.TIKTOK ❮APK TIKTOK VIDEO KA LINK❯*");
    if (!q.includes("tiktok.com")) return reply("*YEH TIKTOK VIDEO KA LINK NAHI 😏*");

    reply("*APKI TIKTOK VIDEO DOWNLOAD HO RAHI HAI ☺️❤️*");

    const apiUrl = `https:                                               
    const { data } = await axios.get(apiUrl);

    if (!data.status || !data.data) return reply("*APKI VIDEO NAHI MILI SORRY 😔*");

    const { title, like, comment, share, author, meta } = data.data;
    const videoUrl = meta.media.find(v => v.type === "video").org;

    const caption = `//kaiz-apis.gleeze.com/api/tiktok-dl?url=${q}`;
    const { data } = await axios.get(apiUrl);

    if (!data.status || !data.data) return reply("*APKI VIDEO NAHI MILI SORRY 😔*");

    const { title, like, comment, share, author, meta } = data.data;
    const videoUrl = meta.media.find(v => v.type === "video").org;

    const caption = `👑 BILAL-MD WHATSAPP BOT 👑`;

    await conn.sendMessage(from, { video: { url: videoUrl }, caption: caption }, { quoted: mek });
  } catch (e) {
    reply("*APKI VIDEO NAHI MILI SORRY 😔*");
  }
});
