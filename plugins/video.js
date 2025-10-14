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
  pattern: 'video',
  alias: ['ytmp4', 'mp4', 'ytv', 'vi', 'v', 'vid', 'vide', 'videos', 'ytvi', 'ytvid', 'ytvide', 'ytvideos', 'searchyt', 'download', 'get', 'need', 'search'],
  desc: 'Download YouTube video (multi-quality) using Izumi API.',
  category: 'download',
  react: '📥',
  filename: __filename
},
async (conn, mek, m, { from, args, reply, quoted }) => {
  let waitingMsg;

  try {
    await conn.sendMessage(from, { react: { text: "🥺", key: m.key } });

    if (!args[0]) {
      return reply(
        "*AP NE KOI VIDEO DOWNLOAD KARNI HAI 🥺*\n" +
        "*TO AP ESE LIKHO 😇*\n\n" +
        "*VIDEO ❮APKE VIDEO KA NAM❯*\n\n" +
        "*AP COMMAND ❮VIDEO❯ LIKH KAR USKE AGE APNI VIDEO KA NAME LIKH DO ☺️ FIR WO VIDEO DOWNLOAD KAR KE YAHA BHEJ DE JAYE GE 🥰💞*"
      );
    }

    let provided = args.join(' ').trim() || (quoted && (quoted.text || quoted.caption)) || '';
    let ytUrl = extractUrl(provided);

    waitingMsg = await conn.sendMessage(
      from,
      { text: "*APKI VIDEO DOWNLOAD HO RAHI HAI 🥺 JAB DOWNLOAD COMPLETE HO JAYE GE ☺️ TO YAHA PER BHEJ DE JAYE GE 🥰♥️*\n*THORA SA INTAZAR KARE.....😊*" },
      { quoted: m }
    );
    await conn.sendMessage(from, { react: { text: "😃", key: m.key } });

    if (!ytUrl) {
      const search = await yts(provided);
      if (!search?.all?.length) {
        await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
        return reply("*APKI VIDEO MUJHE NAHI MIL RAHI 🥺*\n*DUBARA KOSHISH KARE 🥺*");
      }
      ytUrl = search.all[0].url;
    }

    const apiUrl = `https://izumiiiiiiii.dpdns.org/downloader/youtube?url=${encodeURIComponent(ytUrl)}`;
    const { data } = await axios.get(apiUrl, { headers: { accept: '*/*' }, timeout: 30000 });

    if (!data?.status || !data?.result?.formats?.length) {
      await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
      if (waitingMsg) await conn.sendMessage(from, { delete: waitingMsg.key });
      return reply("*APKI VIDEO MUJHE NAHI MIL RAHI 🥺*\n*DUBARA KOSHISH KARE 🥺*");
    }

    const { title, thumbnail, author, formats } = data.result;

    // 🎥 Quality options banate hain
    let qualityList = `*👑 ${title}*\n\n📊 *Available Qualities:*\n\n`;
    formats.forEach((f, i) => {
      qualityList += `*${i + 1}.* ${f.quality || 'Unknown'} - ${f.size || 'Unknown size'}\n`;
    });
    qualityList += `\n*Reply me number likhe jis quality ki video chahiye ☺️*`;

    await conn.sendMessage(from, { image: { url: thumbnail }, caption: qualityList }, { quoted: m });

    // 🕒 Wait for user reply
    const response = await conn.waitForMessage(m.chat, (msg) => msg.key.fromMe === false && /^\d+$/.test(msg.message.conversation?.trim()), { timeout: 30000 });

    if (!response) {
      await reply("*AP NE KOI OPTION NAHI DIYA 🥺*");
      await conn.sendMessage(from, { delete: waitingMsg.key });
      return;
    }

    const choice = parseInt(response.message.conversation.trim());
    const selected = formats[choice - 1];
    if (!selected) {
      await reply("*GALAT OPTION 🥺 DUBARA KOSHISH KARE 🥺*");
      await conn.sendMessage(from, { delete: waitingMsg.key });
      return;
    }

    await reply(`*✅ Downloading ${selected.quality} (${selected.size})...*`);

    await conn.sendMessage(from, {
      video: { url: selected.download },
      fileName: `${title.replace(/[\\/:*?"<>|]/g, '')}_${selected.quality}.mp4`,
      mimetype: 'video/mp4',
      caption: `🎬 *${title}*\n👑 *Quality:* ${selected.quality}\n📦 *Size:* ${selected.size}\n\n*MENE APKI VIDEO DOWNLOAD KAR DI HAI OK ☺️🌹*\n*👑 BY :❯ BILAL-MD 👑*`
    }, { quoted: m });

    await conn.sendMessage(from, { delete: waitingMsg.key });
    await conn.sendMessage(from, { react: { text: "🥰", key: m.key } });

  } catch (e) {
    console.error('video cmd error =>', e?.message || e);
    if (waitingMsg) await conn.sendMessage(from, { delete: waitingMsg.key });
    await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
    reply("*APKI VIDEO MUJHE NAHI MIL RAHI 🥺*\n*DUBARA KOSHISH KARE 🥺*");
  }
});
