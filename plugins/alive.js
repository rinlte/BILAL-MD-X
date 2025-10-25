if (global.aliveCommandLoaded) return;
global.aliveCommandLoaded = true;

const { cmd } = require('../command');
const { sleep } = require('../lib/functions');

// All greeting words it will detect
const greetings = [
  "hi", "hii", "hy", "hey", "hello", "hola", "salam", "slm",
  "aslam", "assalam", "assalamu", "assalamualaikum",
  "as-salamu", "as-salamu-alaikum", "السلام", "السلام عليكم",
  "سلام", "hai", "halo"
];

// ======================
//  ALIVE COMMAND (manual)
// ======================
cmd({
  pattern: "alive",
  alias: ["status", "online", "a", "active"],
  desc: "Check bot is alive or not with live line updates",
  category: "main",
  react: "🥰",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  await runAliveCommand(conn, mek, from);
});

// ======================
//  AUTO GREETING REPLY
// ======================
cmd({
  pattern: ".*", // match all messages
  dontAddCommandList: true
}, async (conn, mek, m, { body, from, isCmd }) => {
  try {
    if (isCmd) return; // skip commands with prefix like .alive, .menu, etc.
    const text = (body || "").toLowerCase().trim();

    // check if text includes greeting
    if (greetings.some(word => text.includes(word))) {
      await conn.sendMessage(from, { react: { text: "🤲", key: mek.key } });
      await runAliveCommand(conn, mek, from);
    }

  } catch (err) {
    console.error("Auto Greeting Error:", err);
  }
});

// ======================
//  MAIN FUNCTION
// ======================
async function runAliveCommand(conn, mek, from) {
  try {
    const lines = [
      "*ASSALAMUALAIKUM ☺️*",
      "\n*KESE HAI AP 😇*",
      "\n*UMEED HAI KE AP KHARIYAT SE HOGE AUR BEHTAR HOGE 🥰*",
      "\n*AUR APKE GHAR ME BHI SAB KHARIYAT SE HOGE 🥰*",
      "\n*DUWA KRE GE APKE LIE 🤲*",
      "\n*ALLAH AP SAB KO HAMESHA KHUSH RAKHE AMEEN 🤲*",
      "\n*ALLAH AP SAB KI MUSHKIL PARSHANIYA DOOR KARE AMEEN 🤲*",
      "\n*AP APNA BAHUT KHAYAL RAKHIA KARO 🥰*",
      "\n*AUR HAMESHA KHUSH RAHA KARO 🥰*",
      "\n*Q K APKI SMILE BAHUT PYARY HAI MASHALLAH ☺️*",
      "\n*IS LIE APNE CHEHRE PER HAR WAKAT SMILE RAKHO 🥰*",
      "\n*KABHI SAD MAT HOYE 🥺♥️*",
      "\n\n*👑 BILAL-MD WHATSAPP BOT 👑*"
    ];

    let currentText = "";
    const msg = await conn.sendMessage(from, { text: currentText }, { quoted: mek });

    for (const line of lines) {
      currentText += line + "\n";
      await sleep(3000);
      await conn.relayMessage(from, {
        protocolMessage: {
          key: msg.key,
          type: 14,
          editedMessage: { conversation: currentText }
        }
      }, {});
    }

  } catch (e) {
    console.error("Alive CMD Error:", e);
    await conn.sendMessage(from, { text: `*ALIVE CMD ERROR 🥺* ${e.message}` }, { quoted: mek });
  }
}
