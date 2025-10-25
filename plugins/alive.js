if (global.aliveCommandLoaded) return;
global.aliveCommandLoaded = true;

const { cmd } = require('../command');
const { sleep } = require('../lib/functions');

// List of greeting words (in multiple languages)
const greetings = [
  "hi", "hii", "hy", "hey", "hello", "hola", "salam", "slm",
  "aslam", "assalam", "assalamu", "assalamualaikum",
  "as-salamu", "as-salamu-alaikum", "السلام", "السلام عليكم",
  "سلام", "hai", "halo"
];

// -------------------
// AUTO GREETING HANDLER
// -------------------
cmd({
  on: "text" // Triggered for every incoming message
}, async (conn, mek, m, { body, from, reply }) => {
  try {
    const text = (body || "").trim().toLowerCase();

    // Check if user's message contains any greeting
    if (greetings.some(word => text.includes(word))) {
      await conn.sendMessage(from, { react: { text: "🤲", key: mek.key } }); // react to message
      await runAliveCommand(conn, mek, from); // run alive lines
    }

  } catch (err) {
    console.error("Auto Greeting Error:", err);
  }
});

// -------------------
// MANUAL ALIVE COMMAND (optional)
// -------------------
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

// -------------------
// FUNCTION TO SEND LINES
// -------------------
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

    // Gradually edit the message line by line
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
