const axios = require('axios');
const yts = require('yt-search');
const { cmd } = require('../command');

cmd({
  pattern: "song",
  alias: ["music", "play", "audio"],
  desc: "Download songs from YouTube (Delirius API)",
  category: "download",
  react: "🎵",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  let waitMsg; // reference for waiting message
  try {
    if (!q) return reply("❌ *Usage:* .song Shape of You or paste YouTube link");

    // React command msg 🥺
    await conn.sendMessage(from, { react: { text: "🥺", key: m.key } });

    // 🔍 YouTube search or direct link
    let video;
    if (q.includes("youtube.com") || q.includes("youtu.be")) {
      video = { url: q };
    } else {
      const search = await yts(q);
      if (!search || !search.videos.length) {
        await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
        return reply("❌ No results found for your query.");
      }
      video = search.videos[0];
    }

    // Waiting message
    waitMsg = await conn.sendMessage(from, { text: "*APKA SONG DOWNLOAD HO RAHI HAI ☺️*\n*JAB DOWNLOAD COMPLETE HO JAYE GE TO YAHA BHEJ DE JAYE GE 🥰*" });

    // 🎧 Fetch audio from Delirius API
    const apiUrl = `https://delirius-apiofc.vercel.app/download/ytmp3?url=${encodeURIComponent(video.url)}`;
    const res = await axios.get(apiUrl, { timeout: 30000 });

    if (!res.data || !res.data.url) {
      if (waitMsg) await conn.sendMessage(from, { delete: waitMsg.key });
      await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
      return reply("*DUBARA KOSHISH KARE 🥺*");
    }

    const audioUrl = res.data.url;
    const title = res.data.title || video.title;

    // Delete waiting message
    if (waitMsg) await conn.sendMessage(from, { delete: waitMsg.key });

    // Send audio info
    const caption = `🎧 *Ｎｏｗ Ｐｌａｙɪɴɢ...*\n\n` +
      `🎵 *Title:* ${title}\n` +
      `📺 *Channel:* ${video.author?.name || 'Unknown'}\n` +
      `⏳ *Duration:* ${video.timestamp}\n` +
      `👀 *Views:* ${video.views?.toLocaleString() || 'N/A'}\n` +
      `🔗 *Link:* ${video.url}\n\n` +
      `⚡ *Powered By BILAL-MD × DELIRIUS API* ⚡`;

    await conn.sendMessage(from, {
      image: { url: video.thumbnail },
      caption,
      contextInfo: { forwardingScore: 999, isForwarded: true }
    }, { quoted: m });

    // Send the MP3 audio
    await conn.sendMessage(from, {
      audio: { url: audioUrl },
      mimetype: "audio/mpeg",
      fileName: `${title}.mp3`,
      ptt: false
    }, { quoted: m });

    // React command message after success ☺️
    await conn.sendMessage(from, { react: { text: "☺️", key: m.key } });

  } catch (err) {
    console.error("🎵 Song command error:", err);
    if (waitMsg) await conn.sendMessage(from, { delete: waitMsg.key });
    await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
    reply("*DUBARA KOSHISH KARE 🥺*");
  }
});
