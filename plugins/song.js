const axios = require('axios');
const yts = require('yt-search');
const { cmd } = require('../command');

// =============================
// 🎧 SONG DOWNLOAD COMMAND (Using PrinceTech API)
// =============================
cmd({
  pattern: "song",
  alias: ["music", "play"],
  desc: "Download song from YouTube",
  category: "download",
  react: "🎵",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q) return reply("❌ Usage: *.song shape of you*");

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
      caption: `🎶 *Sᴇᴀʀᴄʜɪɴɢ ʏᴏᴜʀ sᴏɴɢ...*\n\n*🎵 Tɪᴛʟᴇ:* ${video.title}\n*⏳ Dᴜʀᴀᴛɪᴏɴ:* ${video.timestamp}`
    }, { quoted: m });

    // 3️⃣ Fetch from PrinceTech API
    const apiUrl = `https://api.princetechn.com/api/download/ytmp3?apikey=prince&url=${encodeURIComponent(video.url)}`;
    const res = await axios.get(apiUrl, {
      timeout: 30000,
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
    });

    // 4️⃣ Validate response
    if (!res.data || !res.data.status || !res.data.result?.download) {
      return reply("❌ Fᴀɪʟᴇᴅ ᴛᴏ ғᴇᴛᴄʜ sᴏɴɢ. Tʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.");
    }

    const audioUrl = res.data.result.download;
    const title = res.data.result.title || video.title;

    // 5️⃣ Fancy caption
    const caption = `🎧 *Ｎｏｗ Ｐｌａｙｉｎｇ...*\n\n` +
      `*🎵 Ｔｉｔｌｅ:* ${title}\n` +
      `*📺 Ｃｈａｎｎｅｌ:* ${video.author?.name || 'Unknown'}\n` +
      `*⏳ Ｄｕｒａｔｉｏｎ:* ${video.timestamp}\n` +
      `*👀 Ｖｉｅｗｓ:* ${video.views?.toLocaleString() || 'N/A'}\n` +
      `*🔗 Ｌｉｎｋ:* ${video.url}\n\n` +
      `⚡ 𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐁𝐲 *ＢＩＬＡＬ ＭＤ × PRINCE TECH* ⚡`;

    // 6️⃣ Send song details
    await conn.sendMessage(from, {
      image: { url: video.thumbnail },
      caption,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true
      }
    }, { quoted: m });

    // 7️⃣ Send the audio
    await conn.sendMessage(from, {
      audio: { url: audioUrl },
      mimetype: "audio/mpeg",
      fileName: `${title}.mp3`,
      ptt: false
    }, { quoted: m });

  } catch (err) {
    console.error("🎵 Song command error:", err);
    reply("❌ Fᴀɪʟᴇᴅ ᴛᴏ ᴘʀᴏᴄᴇss ʏᴏᴜʀ ʀᴇǫᴜᴇsᴛ. Pʟᴇᴀsᴇ ᴛʀʏ ᴀɢᴀɪɴ ʟᴀᴛᴇʀ.");
  }
});
