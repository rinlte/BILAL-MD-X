const { cmd } = require('../command');
const { runtime } = require('../lib/functions');

cmd({
  pattern: "uptime",
  alias: ["runtime", "up"],
  desc: "Show bot uptime live",
  category: "main",
  react: "☺️",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    // Pehle react
    await conn.sendMessage(from, { react: { text: "☺️", key: mek.key } });

    // Initial uptime message
    let uptimeSeconds = process.uptime();
    const msg = await conn.sendMessage(from, {
      text: `*👑 UPTIME:❯ ${runtime(uptimeSeconds)} 👑*`
    }, { quoted: mek });

    // Interval: update every 5 seconds
    const interval = setInterval(async () => {
      try {
        uptimeSeconds = process.uptime();
        const text = `*👑 UPTIME:❯ ${runtime(uptimeSeconds)} 👑*`;

        // Edit the same message
        await conn.sendMessage(from, { text }, { quoted: mek, edit: msg.key });
      } catch (err) {
        console.error("Edit uptime error:", err);
      }
    }, 5000);

    // Stop interval after 30 minutes
    setTimeout(() => clearInterval(interval), 30 * 60 * 1000);

  } catch (e) {
    console.error("Uptime Error:", e);
    reply(`❌ Error: ${e.message}`);
  }
});
