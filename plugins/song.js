// 🎵 AUDIO DOWNLOADER CMD BY BILAL-MD
// github.com/BilalTech05/BILAL-MD
// Credits: BILAL & GPT-5

const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "audio",
  alias: ["song", "ytaudio", "music"],
  react: "🎵",
  desc: "Download YouTube audio by title or link.",
  category: "download",
  use: ".audio <song name or link>",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  try {
    const q = args.join(" ");
    const keyForReact = m.key;

    if (!q) {
      await conn.sendMessage(from, { react: { text: "😔", key: keyForReact } });
      return await reply("*APKA AUDIO KA LINK YA QUERY NAHI MILI 🥺*");
    }

    // show waiting msg
    let waitingMsg;
    try {
      waitingMsg = await conn.sendMessage(from, { text: "*AUDIO DOWNLOAD HO RAHA HAI... THORA SA INTIZAR KARE ☺️*" });
    } catch {}

    // call API
    const apiUrl = `https://api.nekolabs.my.id/downloader/youtube/play/v1?q=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl, { headers: { accept: "*/*" }, timeout: 60000 });

    if (!data?.status || !data?.data?.url) {
      await conn.sendMessage(from, { react: { text: "😔", key: keyForReact } });
      if (waitingMsg?.key) await conn.sendMessage(from, { delete: waitingMsg.key });
      return reply("*APKA AUDIO MUJHE NAHI MILA 🥺 AP APNA AUDIO DUBARA DOWNLOAD KARO ☺️*");
    }

    const { title, thumbnail, channel, views, likes, duration, url: downloadUrl } = data.data;

    const caption = `*__________________________________*\n*👑 AUDIO KA NAME 👑*\n *${title || "Unknown"}*\n*__________________________________*\n*👑 CHANNEL :❯ ${channel || 'Unknown'}*\n*__________________________________*\n*👑 VIEWS:❯ ${views || '—'}*\n*__________________________________*\n*👑 LIKES :❯ ${likes || '—'}*\n*__________________________________*\n*👑 TIME:❯ ${duration || '—'}*\n*__________________________________*`;

    await conn.sendMessage(from, { image: { url: thumbnail }, caption }, { quoted: m });

    // try to download buffer
    let audioBuffer;
    try {
      const res = await axios.get(downloadUrl, { responseType: "arraybuffer", timeout: 120000 });
      audioBuffer = Buffer.from(res.data);
    } catch (e) {
      console.log("Buffer download fail:", e.message);
    }

    const safeFileName = (title || "audio").replace(/[\\/:*?"<>|]/g, "") + ".mp3";

    if (audioBuffer?.length) {
      await conn.sendMessage(from, {
        audio: audioBuffer,
        mimetype: "audio/mpeg",
        fileName: safeFileName,
        ptt: false
      }, { quoted: m });
    } else {
      await conn.sendMessage(from, {
        audio: { url: downloadUrl },
        mimetype: "audio/mpeg",
        fileName: safeFileName,
        ptt: false
      }, { quoted: m });
    }

    const finalMsg = `*_________________________________________*\n*👑 AUDIO KA NAME 👑* \n*${title || "Unknown"}*\n*_________________________________________*\n*MENE APKA AUDIO DOWNLOAD KAR DIA HAI OK ☺️ OR KOI AUDIO CHAHYE TO MUJHE BATANA 😍 KAR DE GE DOWNLOAD KOI MASLA NAHI BEE HAPPY DEAR 🥰💞*\n*_________________________________________*\n*👑 BY :❯ BILAL-MD 👑*\n*_________________________________________*`;

    await conn.sendMessage(from, { text: finalMsg }, { quoted: m });

    if (waitingMsg?.key) await conn.sendMessage(from, { delete: waitingMsg.key });
    await conn.sendMessage(from, { react: { text: "🥰", key: keyForReact } });

  } catch (err) {
    console.log("❌ AUDIO CMD ERROR:", err);
    await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
    await reply("*ERROR: AUDIO SEND KARNE ME PROBLEM A GAYI 🥺 DUBARA TRY KARO ☹️*");
  }
});
