const { cmd } = require('../command');
const axios = require('axios');

cmd({
  pattern: "tiktok",
  alias: ["ttdl", "tt", "tiktokdl"],
  desc: "Download TikTok video without watermark",
  category: "downloader",
  react: "🎵",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  let progressMsg; // Progress message reference
  try {
    // Command msg react 🥺
    await conn.sendMessage(from, { react: { text: "🥺", key: mek.key } });

    // Show download progress
    progressMsg = await conn.sendMessage(from, { text: "*APKI TIKTOK VIDEO DOWNLOAD HO RAHI HAI....☺️*" });

    if (!q) {
      await conn.sendMessage(from, { delete: progressMsg.key });
      return reply("*KISI BHI TIKTOK VIDEO KA LINK COPY KAR LO AUR ESE LIKHO ☺️❤️*\n\n*.TIKTOK ❮APK TIKTOK VIDEO KA LINK❯*");
    }

    if (!q.includes("tiktok.com")) {
      // Galat link react 😫
      await conn.sendMessage(from, { react: { text: "😫", key: mek.key } });
      await conn.sendMessage(from, { delete: progressMsg.key });
      return reply("*YEH TIKTOK VIDEO KA LINK NAHI 😏*");
    }

    // API call
    const apiUrl = `https://kaiz-apis.gleeze.com/api/tiktok-dl?url=${q}`;
    const { data } = await axios.get(apiUrl);

    if (!data.status || !data.data) {
      // URL fetch fail react 😫
      await conn.sendMessage(from, { react: { text: "😫", key: mek.key } });
      await conn.sendMessage(from, { delete: progressMsg.key });
      return reply("*APKI VIDEO NAHI MILI SORRY 😔*");
    }

    // URL fetch success react 😫
    await conn.sendMessage(from, { react: { text: "😫", key: mek.key } });

    const videoUrl = data.data.meta.media.find(v => v.type === "video").org;
    const caption = "*👑 BY :❯ BILAL-MD 👑*";

    // Send video
    await conn.sendMessage(from, { video: { url: videoUrl }, caption: caption }, { quoted: mek });

    // Command msg react ☺️
    await conn.sendMessage(from, { react: { text: "☺️", key: mek.key } });

    // Delete progress message after video sent
    await conn.sendMessage(from, { delete: progressMsg.key });

  } catch (e) {
    console.error(e);
    // Error react 😔
    await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
    // Delete progress message on error
    if (progressMsg) await conn.sendMessage(from, { delete: progressMsg.key });
    reply("*APKI VIDEO NAHI MILI SORRY 😔*");
  }
});
