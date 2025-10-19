const q = provided;
const apiUrl = `https://api.nekolabs.my.id/downloader/youtube/play/v1?q=${encodeURIComponent(q)}`;
const { data } = await axios.get(apiUrl, { headers: { accept: '*/*' }, timeout: 30000 });

if (!data?.status || !data?.data?.url) {
  await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
  if (waitingMsg) await conn.sendMessage(from, { delete: waitingMsg.key });
  return reply("*APKA AUDIO MUJHE NAHI MILA 🥺 AP APNA AUDIO DUBARA DOWNLOAD KARO ☺️*");
}

const { title, thumbnail, channel, views, likes, duration, url: download } = data.data;

// 🔹 Thumbnail caption (audio info)
const thumbCaption = `*__________________________________*\n*👑 AUDIO KA NAME 👑*\n *${title}*\n*__________________________________*\n*👑 CHANNEL :❯ ${channel || 'Unknown'}*\n*__________________________________*\n*👑 VIEWS:❯ ${views || '—'}*\n*__________________________________*\n*👑 LIKES :❯ ${likes || '—'}*\n*__________________________________*\n*👑 TIME:❯ ${duration || '—'}*\n*__________________________________*`;

thumbMsg = await conn.sendMessage(from, { image: { url: thumbnail }, caption: thumbCaption }, { quoted: m });

try {
  // 🔹 Final audio caption (downloaded message)
  const finalCaption = `*_________________________________________*\n*👑 AUDIO KA NAME 👑* \n*${title}*\n*_________________________________________*\n*MENE APKA AUDIO DOWNLOAD KAR DIA HAI OK ☺️ OR KOI AUDIO CHAHYE TO MUJHE BATANA 😍 KAR DE GE DOWNLOAD KOI MASLA NAHI BEE HAPPY DEAR 🥰💞*\n*_________________________________________*\n*👑 BY :❯ BILAL-MD 👑*\n*_________________________________________*`;

  await conn.sendMessage(from, {
    audio: { url: download },
    mimetype: 'audio/mpeg',
    fileName: `${title.replace(/[\\/:*?"<>|]/g, '')}.mp3`,
    ptt: false
  }, { quoted: m });

  // Caption message alag bhejna (audio ke baad)
  captionMsg = await conn.sendMessage(from, { text: finalCaption }, { quoted: m });

  if (waitingMsg) await conn.sendMessage(from, { delete: waitingMsg.key });
  await conn.sendMessage(from, { react: { text: "🥰", key: m.key } });

} catch (err) {
  await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
  await reply("*ERROR: AUDIO SEND KARNE ME PROBLEM A GAYI 🥺 DUBARA TRY KARO ☹️*");
}
