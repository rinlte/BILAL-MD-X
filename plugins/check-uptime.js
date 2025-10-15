// code by WHITESHADOW
const { cmd } = require('../command');
const { runtime, sleep } = require('../lib/functions');

cmd({
  pattern: "uptime",
  alias: ["runtime", "up"],
  desc: "Show bot uptime with live updates for 30 minutes",
  category: "main",
  react: "⏱️",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    // Send initial message
    const msg = await conn.sendMessage(from, {
      text: `*👑 UPTIME :❯ Starting...*`
    }, { quoted: mek });

    // Update loop: update every second for 30 minutes (1800 seconds)
    for (let i = 0; i < 1800; i++) {
      const up = runtime(process.uptime());

      await sleep(1000); // wait 1 second
      await conn.relayMessage(from, {
        protocolMessage: {
          key: msg.key,
          type: 14,
          editedMessage: {
            conversation: `*👑 UPTIME :❯ ${up} 👑*`
          }
        }
      }, {});
    }

    // After 30 minutes, just stop updating (no final message)

  } catch (e) {
    console.error("*DUBARA ❮UPTIME❯ LIKHO 🥺*", e);
    reply(`*DUBARA ❮UPTIME❯ LIKHO 🥺* ${e.message}`);
  }
});
