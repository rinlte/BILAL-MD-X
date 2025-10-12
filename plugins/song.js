const axios = require('axios');
const yts = require('yt-search');
const { cmd } = require('../command');

// =============================
// 🎬 VIDEO DOWNLOAD COMMAND (Using PrinceTech API)
// =============================
cmd({
  pattern: "song",
  alias: ["music", "play", "video"],
  desc: "Download video from YouTube",
  category: "download",
  react: "🎥",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q) return reply("❌ Usage: *.song shape of you* or paste YouTube link");

    // 1️⃣ Search video
    let video;
    if (q.includes("youtube.com") || q.includes("youtu.be")) {
      video = { url: q };
    } else {
      const search = await yts(q);
      if (!search || !search.videos.length)
        return reply("❌ No results found for your query.");
      video = search.videos[0];
    }

    // 2️⃣ Notify user
    await conn.sendMessage(from, {
      image: { url: video.thumbnail },
      caption: `🎬 *Fᴇᴛᴄʜɪɴɢ ʏᴏᴜʀ ᴠɪᴅᴇᴏ...*\n\n*🎵 Title:* ${video.title}\n*⏳ Duration:* ${video.timestamp}`
    }, { quoted: m });

    // 3️⃣ Fetch from PrinceTech MP4 API
    const apiUrl = `https://api.princetechn.com/api/download/ytmp4?apikey=prince&url=${encodeURIComponent(video.url)}`;
    const res = await axios.get(apiUrl, {
      timeout: 30000,
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
    });

    // 4️⃣ Validate response
    if (!res.data || !res.data.status || !res.data.result?.download) {
      return reply("❌ Fᴀɪʟᴇᴅ ᴛᴏ ғᴇᴛᴄʜ ᴠɪᴅᴇᴏ. Tʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.");
    }

    const videoUrl = res.data.result.download;
    const title = res.data.result.title || video.title;

    // 5️⃣ Fancy caption
    const caption = `🎬 *Ｎｏｗ Ｐｌａｙｉｎｇ...*\n\n` +
      `*🎵 Ｔｉｔｌｅ:* ${title}\n` +
      `*📺 Ｃｈａｎｎｅｌ:* ${video.author?.name || 'Unknown'}\n` +
      `*⏳ Ｄｕｒａｔɪᴏɴ:* ${video.timestamp}\n` +
      `*👀 Ｖɪᴇᴡs:* ${video.views?.toLocaleString() || 'N/A'}\n` +
      `*🔗 Ｌɪɴᴋ:* ${video.url}\n\n` +
      `⚡ 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 *ＢＩＬＡＬ ＭＤ × PRINCE TECH* ⚡`;

    // 6️⃣ Send video details
    await conn.sendMessage(from, {
      image: { url: video.thumbnail },
      caption,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true
      }
    }, { quoted: m });

    // 7️⃣ Send video file
    await conn.sendMessage(from, {
      video: { url: videoUrl },
      mimetype: "video/mp4",
      fileName: `${title}.mp4`,
      caption: `🎬 ${title}`,
    }, { quoted: m });

  } catch (err) {
    console.error("🎬 Video command error:", err);
    reply("❌ Fᴀɪʟᴇᴅ ᴛᴏ ᴘʀᴏᴄᴇss ʏᴏᴜʀ ʀᴇǫᴜᴇsᴛ. Pʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.");
  }
});
