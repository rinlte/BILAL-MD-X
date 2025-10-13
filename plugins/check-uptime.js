const { cmd } = require('../command');
const { runtime } = require('../lib/functions');

cmd({
  pattern: "uptime",
  alias: ["runtime", "up"],
  desc: "Show bot uptime live",
  category: "main",
  react: "⏱️",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    // Pehle react
    await conn.sendMessage(from, { react: { text: "⏱️", key: mek.key } });

    // Send initial message
    let uptimeSeconds = process.uptime();
    const msg = await conn.sendMessage(from, { text: `*👑 UPTIME:❯ ${runtime(uptimeSeconds)} 👑*` }, { quoted: mek });

    // Live update har 5 sec
    const interval = setInterval(async () => {
      try {
        uptimeSeconds = process.uptime();
        const text = `*👑 UPTIME:❯ ${runtime(uptimeSeconds)} 👑*`;
        await conn.sendMessage(from, { text }, { quoted: mek, edit: msg.key }); // edit existing message
      } catch(e) {
        console.error("Edit uptime error:", e);
      }
    }, 5000);

    // Optional: stop updating after 1 hour
    setTimeout(() => clearInterval(interval), 3600 * 1000);

  } catch (e) {
    console.error("Uptime Error:", e);
    reply(`❌ Error: ${e.message}`);
  }
});
