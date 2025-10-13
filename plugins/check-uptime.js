const { cmd } = require('../command');
const { runtime } = require('../lib/functions');

cmd({
  pattern: "uptime",
  alias: ["runtime", "upt", "upti", "uptim", "uptimes", "ut", "utime", "u"],
  desc: "Show bot uptime",
  category: "main",
  react: "☺️",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const uptime = runtime(process.uptime());

    const message = `*👑 UPTIME:❯ ${uptime} 👑*`;

    await conn.sendMessage(from, {
      text: message
    }, { quoted: mek });

  } catch (e) {
    console.error("Uptime Error:", e);

    // Send error message with react 😔
    const errMsg = await conn.sendMessage(from, {
      text: "DUBARA KOSHISH KARE 🥺🌹"
    }, { quoted: mek });

    // React 😔 on error message
    await conn.sendMessage(from, { react: { text: "😔", key: errMsg.key } });
  }
});
