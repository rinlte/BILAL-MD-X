const axios = require('axios');
const yts = require('yt-search');
const { cmd } = require('../command');

// =============================
// 🎧 SONG DOWNLOAD (YTAudio 128kbps)
// =============================
cmd({
  pattern: "song",
  alias: ["music", "play", "audio"],
  desc: "Download high-quality audio (MP3 128kbps) from YouTube",
  category: "download",
  react: "🎶",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q) return reply("❌ Usage: *.song shape of you* or paste YouTube link.");

    // 🔍 YouTube search or direct link
    let video;
    if (q.includes("youtube.com") || q.includes("youtu.be")) {
      video = { url: q };
    } else {
      const search = await yts(q);
      if (!search || !search.videos.length)
        return reply("❌ No results found for your query.");
      video = search.videos[0];
    }

    // 🕒 Notify user
    await conn.sendMessage(from, {
      image: { url: video.thumbnail },
      caption: `🎧 *Fetching your song...*\n\n🎵 *Title:* ${video.title}\n⏳ *Duration:* ${video.timestamp}`
    }, { quoted: m });

    // 🎵 Fetch from PrinceTech YTAudio API
    const apiUrl = `https://api.princetechn.com/api/download/ytaudio?apikey=prince&format=128kbps&url=${encodeURIComponent(video.url)}`;
    const res = await axios.get(apiUrl, { timeout: 30000 });

    // ⚠️ Validate API response
    if (!res.data || !res.data.status || !res.data.result?.download) {
      return reply("❌ Failed to fetch audio. Try again later.");
    }

    const audioUrl = res.data.result.download;
    const title = res.data.result.title || video.title;

    // ✨ Caption with info
    const caption = `🎧 *Ｎｏｗ Ｐｌａｙɪɴɢ...*\n\n` +
      `🎵 *Title:* ${title}\n` +
      `📺 *Channel:* ${video.author?.name || 'Unknown'}\n` +
      `⏳ *Duration:* ${video.timestamp}\n` +
      `👀 *Views:* ${video.views?.toLocaleString() || 'N/A'}\n` +
      `🔗 *Link:* ${video.url}\n\n` +
      `⚡ *Powered By BILAL-MD × PRINCE TECH* ⚡`;

    // 🖼️ Send info message
    await conn.sendMessage(from, {
      image: { url: video.thumbnail },
      caption,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true
      }
    }, { quoted: m });

    // 🎶 Send audio
    await conn.sendMessage(from, {
      audio: { url: audioUrl },
      mimetype: "audio/mpeg",
      fileName: `${title}.mp3`,
      ptt: false
    }, { quoted: m });

  } catch (err) {
    console.error("🎵 Song command error:", err);
    reply("❌ Error fetching audio. Please try again later.");
  }
});
