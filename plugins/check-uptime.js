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
    // React on command
    await conn.sendMessage(from, { react: { text: "⏱️", key: mek.key } });

    // Send initial uptime message
    let uptimeSeconds = process.uptime();
    const sentMsg = await conn.sendMessage(from, {
      text: `*👑 UPTIME:❯ ${runtime(uptimeSeconds)} 👑*`
    }, { quoted: mek });

    // Update interval every 5 seconds
    const interval = setInterval(async () => {
      try {
        uptimeSeconds = process.uptime();
        const newText = `*👑 UPTIME:❯ ${runtime(uptimeSeconds)} 👑*`;

        // Try editing the same message
        await conn.sendMessage(from, { text: newText }, { quoted: mek, edit: sentMsg.key });
      } catch (err) {
        // Agar edit fail ho jaye, ignore kar do
        console.error("Edit uptime error:", err.message);
      }
    }, 5000);

    // Stop after 30 minutes
    setTimeout(() => clearInterval(interval), 30 * 60 * 1000);

  } catch (e) {
    console.error("Uptime Error:", e);
    reply(`❌ Error: ${e.message}`);
  }
});
