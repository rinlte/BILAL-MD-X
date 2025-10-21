// 🧠 Bilal-MD YouTube Downloader (All Songs / Audio)
// Author: ChatGPT x Umar Edition

const axios = require("axios");
const yts = require("yt-search");
const { cmd } = require("../command");

cmd({
  pattern: "play",
  alias: ["song", "ytmusic", "ytaudio"],
  react: "🎧",
  desc: "Download any YouTube song/audio",
  category: "download",
  use: ".play <song name>",
  filename: __filename,
}, async (conn, mek, m, { from, q, args, reply }) => {
  try {
    if (!q) return reply("🔍 Please type song name!\nExample: *.play shape of you*");

    // react hourglass
    await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

    // 🔎 Search on YouTube
    const search = await yts(q);
    if (!search.videos || !search.videos.length) return reply("❌ No results found.");

    const vid = search.videos[0];
    const videoUrl = vid.url;
    const title = vid.title;
    const duration = vid.timestamp;
    const views = vid.views;
    const author = vid.author?.name || "Unknown";

    // Show info
    await reply(`🎵 *Title:* ${title}
📺 *Channel:* ${author}
🕒 *Duration:* ${duration}
👁️ *Views:* ${views}
🌐 *Link:* ${videoUrl}

⏳ Preparing audio, please wait...`);

    // 🔽 Use Nekolabs / OceanSaver API (works for public)
    const api = `https://api.nekolabs.my.id/downloader/youtube/play/v1?q=${encodeURIComponent(q)}`;
    const { data } = await axios.get(api, { timeout: 60000 });

    if (!data || !data.status || !data.data?.url) {
      await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
      return reply("❌ Failed to fetch download link, try another song.");
    }

    const dl = data.data;
    const audioUrl = dl.url;
    const thumbnail = dl.thumbnail;
    const filename = `${title.replace(/[^\w\s]/gi, "")}.mp3`;

    // Send thumbnail + info
    await conn.sendMessage(from, {
      image: { url: thumbnail },
      caption: `🎶 *Now Playing:*\n${title}\n\n📥 Downloading audio...`,
    }, { quoted: mek });

    // Send audio file
    await conn.sendMessage(from, {
      audio: { url: audioUrl },
      mimetype: "audio/mpeg",
      fileName: filename
    }, { quoted: mek });

    await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
  } catch (err) {
    console.log("PLAY CMD ERROR:", err);
    await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    return reply("⚠️ Error fetching or sending the song.");
  }
});
