const config = require('../config');
const { cmd, commands } = require('../command');
const { sleep } = require('../lib/functions');

// 💫 Ping command — single message updating line by line (2s delay)
cmd({
  pattern: "ping",
  desc: "Check bot response and send greeting lines slowly.",
  category: "main",
  react: "🥰",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    // All lines (old + new)
    const lines = [
      "*ASSALAMUALAIKUM ☺️*",
      "\n*KESE HAI AP ☺️*",
      "\n*UMEED HAI KE AP KHARIYT SE HOGE INSHALLAH 🤲🥰*",
      "\n*ALLAH APKO AUR APKE CHANE WALO KO SAB KO HAMESHA KHUSH RAKHE AMEEN 🤲🥰*",
      "\n*APNA KHAYAL RKHO AUR KHUSH RAHO AMEEN 🤲🥰*",
      "\n*AUR BATAYE KESE GUZAR RAHI HAI APKI ZINDAGY 🥰*",
      "\n*NAMAZ BHI PARHA KARO 🥰💞*",
      "\n*AUR QURAN MAJEED KI TILAWAT BHI KIA KARO 🥰💞*",
      "\n*ALLAH PAK KI IBADAT BHI KIA KARO 🥰💞*",
      "\n*BEE HAPPY MY DEAR ☺️💞*"
    ];

    // 🥺 React when command received
    await conn.sendMessage(from, { react: { text: '🥺', key: m.key } });

    const startTime = Date.now();

    // Send first message
    let currentText = lines[0];
    let sentMsg = await conn.sendMessage(from, { text: currentText });

    // Line by line update every 2s
    for (let i = 1; i < lines.length; i++) {
      await sleep(2000);
      currentText = lines.slice(0, i + 1).join("\n");
      try { await conn.sendMessage(from, { delete: sentMsg.key }); } catch (e) {}
      sentMsg = await conn.sendMessage(from, { text: currentText });
    }

    // After all lines, add ping info
    await sleep(2000);
    try { await conn.sendMessage(from, { delete: sentMsg.key }); } catch (e) {}

    const endTime = Date.now();
    const pingText = `${currentText}\n\n*❤️*  (_Response time: ${endTime - startTime} ms_)`;
    sentMsg = await conn.sendMessage(from, { text: pingText });

    // ☺️ React after finished
    await conn.sendMessage(from, { react: { text: '🥰', key: m.key } });

  } catch (e) {
    console.error("Ping command error:", e);
    try { await conn.sendMessage(from, { react: { text: '😔', key: m.key } }); } catch (__) {}
    return reply("*ERROR: DUBARA KOSHISH KARE 🥺*");
  }
});
