const { cmd } = require('../command');
const axios = require('axios');
const yts = require('yt-search');

function extractUrl(text = '') {
  if (!text) return null;
  const urlRegex = /(https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\/[\w\-?=&%.#\/]+)|(youtube\.com\/[\w\-?=&%.#\/]+)/i;
  const match = text.match(urlRegex);
  if (!match) return null;
  return match[0].startsWith('http') ? match[0] : `https://${match[0]}`;
}

cmd({
  pattern: 'play',
  alias: ['song', 'music', 'audio', 'yta', 'ytmp3'],
  desc: 'Download YouTube audio using Izumi API.',
  category: 'download',
  react: '🎧',
  filename: __filename
},
async (conn, mek, m, { from, args, reply, quoted }) => {
  let waitingMsg;
  try {
    await conn.sendMessage(from, { react: { text: "🥺", key: m.key } });

    if (!args[0]) {
      return reply(
        "*AP KO KOI AUDIO DOWNLOAD KARNI HAI 🥺*\n" +
        "*TO AP ESE LIKHO ☺️*\n\n" +
        "*PLAY ❮APKE AUDIO KA NAM❯*\n\n" +
        "*AP COMMAND ❮PLAY❯ LIKH KAR USKE AGE APNE AUDIO KA NAM LIKH DO ☺️ FIR WO AUDIO DOWNLOAD KAR KE YAHA PER BHEJ DE JAYE GE 🥰💞*"
      );
    }

    let provided = args.join(' ').trim() || (quoted && (quoted.text || quoted.caption)) || '';
    let ytUrl = extractUrl(provided);

    waitingMsg = await conn.sendMessage(
      from,
      { text: "*APKA AUDIO DOWNLOAD HO RAHA HAI 🥺 JAB DOWNLOAD COMPLETE HO JAYE GA ☺️ TO YAHA BHEJ DIYA JAYE GA 🥰♥️*\n*THORA SA INTAZAR KARE.....😊*" },
      { quoted: m }
    );
    await conn.sendMessage(from, { react: { text: "🎵", key: m.key } });

    if (!ytUrl) {
      const search = await yts(provided);
      if (!search?.all?.length) {
        await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
        return reply("*APKA AUDIO MUJHE NAHI MILA 🥺 AP APNA AUDIO DUBARA DOWNLOAD KARO ☺️*");
      }
      ytUrl = search.all[0].url;
    }

    const apiUrl = `https://izumiiiiiiii.dpdns.org/downloader/youtube?url=${encodeURIComponent(ytUrl)}&format=mp3`;
    const { data } = await axios.get(apiUrl, { headers: { accept: '*/*' }, timeout: 30000 });

    if (!data?.status || !data?.result?.download) {
      await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
      if (waitingMsg) await conn.sendMessage(from, { delete: waitingMsg.key });
      return reply("*APKA AUDIO MUJHE NAHI MILA 🥺 AP APNA AUDIO DUBARA DOWNLOAD KARO ☺️*");
    }

    const { title, thumbnail, author, metadata, download } = data.result;

    // 🔹 Thumbnail caption (audio info)
    const thumbCaption = `*__________________________________*\n*👑 AUDIO KA NAME 👑*\n *${title}*\n*__________________________________*\n*👑 CHANNEL :❯ ${author?.channelTitle || 'Unknown'}*\n*__________________________________*\n*👑 VIEWS:❯ ${metadata?.view || '—'}*\n*__________________________________*\n*👑 LIKES :❯ ${metadata?.like || '—'}*\n*__________________________________*\n*👑 TIME:❯ ${metadata?.duration || '—'}*\n*__________________________________*`;

    const thumbMsg = await conn.sendMessage(from, { image: { url: thumbnail }, caption: thumbCaption }, { quoted: m });

    try {
      // 🔹 Final audio caption (downloaded message)
      const finalCaption = `*_________________________________\n*👑 AUDIO KA NAME 👑* \n*${title}\n\nMENE APKA AUDIO DOWNLOAD KAR DIA HAI OK ☺️ OR KOI AUDIO CHAHYE TO MUJHE BATANA 😍 KAR DE GE DOWNLOAD KOI MASLA NAHI BEE HAPPY DEAR 🥰💞* \n*\n 👑 BY :❯ BILAL-MD 👑\n`;

      await conn.sendMessage(from, {
        audio: { url: download },
        mimetype: 'audio/mpeg',
        fileName: `${title.replace(/[\\/:*?"<>|]/g, '')}.mp3`,
        ptt: false,
        caption: finalCaption
      }, { quoted: m });

      // delete waiting and thumbnail messages
      if (waitingMsg) await conn.sendMessage(from, { delete: waitingMsg.key });
      if (thumbMsg) await conn.sendMessage(from, { delete: thumbMsg.key });

      await conn.sendMessage(from, { react: { text: "🥰", key: m.key } });

    } catch (err) {
      const finalCaption = `_________________________________\n*👑 AUDIO KA NAME 👑* \n*${title}*\n*__________________________________*\nMENE APKA AUDIO DOWNLOAD KAR DIA HAI OK ☺️ OR KOI AUDIO CHAHYE TO MUJHE BATANA 😍 KAR DE GE DOWNLOAD KOI MASLA NAHI BEE HAPPY DEAR 🥰💞* \n*__________________________________*\n 👑 BY :❯ BILAL-MD 👑\n*__________________________________*`;

      await reply(`*APKA AUDO BAHUT BARI HAI 🥺 IS LIE DUCUMENT ME SEND HO RAHI HAI ☺️♥️*`);
      await conn.sendMessage(from, {
        document: { url: download },
        mimetype: 'audio/mpeg',
        fileName: `${title.replace(/[\\/:*?"<>|]/g, '')}.mp3`,
        caption: finalCaption
      }, { quoted: m });

      if (waitingMsg) await conn.sendMessage(from, { delete: waitingMsg.key });
      if (thumbMsg) await conn.sendMessage(from, { delete: thumbMsg.key });

      await conn.sendMessage(from, { react: { text: "🥰", key: m.key } });
    }

  } catch (e) {
    console.error('play cmd error =>', e?.message || e);
    if (waitingMsg) await conn.sendMessage(from, { delete: waitingMsg.key });
    await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
    reply("*APKA GAANA MUJHE NAHI MILA 🥺*\n*DUBARA KOSHISH KARE 🥺*");
  }
});
