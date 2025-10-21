// 🎵 SONG DOWNLOADER BY BILAL-MD
// github.com/BilalTech05/BILAL-MD
// Uses Izumi + Okatsu APIs with fallback system
// Credits: Bilal & GPT-5

const axios = require("axios");
const yts = require("yt-search");
const { cmd } = require("../command");

const AXIOS_DEFAULTS = {
  timeout: 60000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    Accept: "application/json, text/plain, */*",
  },
};

async function tryRequest(getter, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await getter();
    } catch (err) {
      lastError = err;
      if (attempt < attempts) await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }
  throw lastError;
}

// 🔹 Izumi API (by URL)
async function getIzumiDownloadByUrl(youtubeUrl) {
  const apiUrl = `https://izumiiiiiiii.dpdns.org/downloader/youtube?url=${encodeURIComponent(
    youtubeUrl
  )}&format=mp3`;
  const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
  if (res?.data?.result?.download) return res.data.result;
  throw new Error("Izumi youtube?url returned no download");
}

// 🔹 Izumi API (by query)
async function getIzumiDownloadByQuery(query) {
  const apiUrl = `https://izumiiiiiiii.dpdns.org/downloader/youtube-play?query=${encodeURIComponent(
    query
  )}`;
  const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
  if (res?.data?.result?.download) return res.data.result;
  throw new Error("Izumi youtube-play returned no download");
}

// 🔹 Okatsu fallback API
async function getOkatsuDownloadByUrl(youtubeUrl) {
  const apiUrl = `https://okatsu-rolezapiiz.vercel.app/downloader/ytmp3?url=${encodeURIComponent(
    youtubeUrl
  )}`;
  const res = await tryRequest(() => axios.get(apiUrl, AXIOS_DEFAULTS));
  if (res?.data?.dl) {
    return {
      download: res.data.dl,
      title: res.data.title,
      thumbnail: res.data.thumb,
    };
  }
  throw new Error("Okatsu ytmp3 returned no download");
}

// 🎵 Command registration for Bilal-MD
cmd({
  pattern: "song",
  alias: ["music", "ytaudio", "ytmp3"],
  react: "🎶",
  desc: "Download any YouTube song by name or link (auto fallback).",
  category: "download",
  use: ".song <song name or YouTube link>",
  filename: __filename,
}, async (conn, mek, m, { from, args, reply }) => {
  try {
    const text = args.join(" ");
    if (!text) {
      await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
      return await reply("*Usage:* .song <song name or YouTube link>");
    }

    // Search or use direct URL
    let video;
    if (text.includes("youtube.com") || text.includes("youtu.be")) {
      video = { url: text, title: "YouTube Audio" };
    } else {
      const search = await yts(text);
      if (!search || !search.videos.length) {
        return await reply("❌ *Koi result nahi mila!*");
      }
      video = search.videos[0];
    }

    // Notify user
    await conn.sendMessage(
      from,
      {
        image: { url: video.thumbnail },
        caption: `🎵 *Downloading:* ${video.title}\n⏱ *Duration:* ${video.timestamp || "Unknown"}\n📡 *Source:* YouTube`,
      },
      { quoted: m }
    );

    // Try APIs (Izumi → Query → Okatsu fallback)
    let audioData;
    try {
      audioData = await getIzumiDownloadByUrl(video.url);
    } catch (e1) {
      try {
        const query = video.title || text;
        audioData = await getIzumiDownloadByQuery(query);
      } catch (e2) {
        audioData = await getOkatsuDownloadByUrl(video.url);
      }
    }

    const audioUrl = audioData.download || audioData.dl || audioData.url;
    const fileName = `${(audioData.title || video.title || "song").replace(/[\\/:*?"<>|]/g, "")}.mp3`;

    await conn.sendMessage(
      from,
      {
        audio: { url: audioUrl },
        mimetype: "audio/mpeg",
        fileName,
        ptt: false,
      },
      { quoted: m }
    );

    await conn.sendMessage(from, { react: { text: "✅", key: m.key } });
    await reply(`*🎶 ${video.title}*\n_Aapka song download ho gaya hai!_\n_By Bilal-MD 💞_`);

  } catch (err) {
    console.error("Song command error:", err);
    await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
    await reply("❌ *Song download me problem aayi, dubara try kare!*");
  }
});
