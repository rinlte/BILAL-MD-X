const config = require('../config');
const { cmd } = require('../command');
const { sleep } = require('../lib/functions');

cmd({
  pattern: "ping",
  desc: "Check bot response with live message updates",
  category: "main",
  react: "👑",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    // Lines to show gradually
    const lines = [
      "*ASSALAMUALAIKUM ☺️*",
      "\n*KESE HAI AP ☺️*",
      "\n*UMEED HAI KE AP KHARIYAT SE HOGE INSHALLAH 🤲🥰*",
      "\n*ALLAH APKO AUR APKE CHAHNE WALO KO HAMESHA KHUSH RAKHE AMEEN 🤲🥰*",
      "\n*APNA KHAYAL RKHO AUR KHUSH RAHO AMEEN 🤲🥰*",
      "\n*AUR BATAYE KESE GUZAR RAHI HAI APKI ZINDAGI 🥰*",
      "\n*NAMAZ BHI PARHA KARO 🥰💞*",
      "\n*AUR QURAN MAJEED KI TILAWAT BHI KIA KARO 🥰💞*",
      "\n*ALLAH PAK KI IBADAT BHI KIA KARO 🥰💞*",
      "\n*BEE HAPPY MY DEAR ☺️💞*"
    ];

    // React when command received
    await conn.sendMessage(from, { react: { text: '🥺', key: m.key } });

    // Start ping timer
    const startTime = Date.now();

    // Start with empty text message
    let currentText = "";
    const msg = await conn.sendMessage(from, { text: currentText }, { quoted: mek });

    // Line-by-line edit same message every 2 seconds
    for (const line of lines) {
      currentText += line + "\n";
      await sleep(2000);
      await conn.relayMessage(from, {
        protocolMessage: {
          key: msg.key,
          type: 14,
          editedMessage: { conversation: currentText }
        }
      }, {});
    }

    // Add final ping line after all messages
    await sleep(2000);
    const endTime = Date.now();
    currentText += `\n\n*Gg...☺️*  (_Response time: ${endTime - startTime} ms_)`;

    await conn.relayMessage(from, {
      protocolMessage: {
        key: msg.key,
        type: 14,
        editedMessage: { conversation: currentText }
      }
    }, {});

    // Final react
    await conn.sendMessage(from, { react: { text: '☺️', key: m.key } });

  } catch (e) {
    console.error("Ping command error:", e);
    await conn.sendMessage(from, { react: { text: '😔', key: m.key } });
    reply("*ERROR: DUBARA KOSHISH KARE 🥺*");
  }
});
