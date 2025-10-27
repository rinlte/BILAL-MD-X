const fs = require('fs');
const { cmd } = require('../command');

const filePath = './plugins/antibot-status.json';

// Create antibot status file if missing
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, JSON.stringify({ enabled: false }, null, 2));
}

// Load antibot status
let antibotStatus = JSON.parse(fs.readFileSync(filePath));

// Save helper
function saveStatus() {
  fs.writeFileSync(filePath, JSON.stringify(antibotStatus, null, 2));
}

// Track bot messages
let botMessageCount = {};

cmd({
  pattern: "antibot",
  desc: "Turn AntiBot on/off to auto-remove spam bots.",
  category: "moderation",
  react: "🤖",
  filename: __filename
}, async (conn, m, store, { text, reply }) => {

  const args = text.trim().toLowerCase();

  if (args === 'on') {
    antibotStatus.enabled = true;
    saveStatus();
    await reply('✅ AntiBot is now *ON*! Bots will be detected and removed automatically.');
  } 
  else if (args === 'off') {
    antibotStatus.enabled = false;
    saveStatus();
    await reply('🚫 AntiBot is now *OFF*! Bot messages will not be monitored.');
  } 
  else {
    await reply(`⚙️ *Usage:*\n> antibot on\n> antibot off\n\n*Current status:* ${antibotStatus.enabled ? '✅ ON' : '❌ OFF'}`);
  }
});

// =========================
// AUTO BOT MESSAGE CHECKER
// =========================
cmd({
  onMessage: true, // custom flag (your handler should call on every msg)
  filename: __filename
}, async (conn, m, store, extras) => {
  const { isAdmin, isBotAdmin } = extras || {};
  if (!m.isGroup || m.fromMe) return;

  // Bot ID regex
  const botPatterns = [
    /^3EBO/, /^4EBO/, /^5EBO/, /^6EBO/, /^7EBO/, /^8EBO/,
    /^9EBO/, /^AEBO/, /^BEBO/, /^CEBO/, /^DEBO/, /^EEBO/,
    /^FEBO/, /^ABE5/, /^BAE7/, /^CAEBO/, /^DAEBO/, /^FAEBO/
  ];

  if (!antibotStatus.enabled) return;

  if (botPatterns.some(rx => rx.test(m.key.id)) && m.key.remoteJid.endsWith('@g.us')) {
    const sender = m.key.participant;
    botMessageCount[sender] = (botMessageCount[sender] || 0) + 1;

    console.log(`🤖 ${sender} sent ${botMessageCount[sender]} suspected bot messages.`);

    if (botMessageCount[sender] >= 5) {
      if (isBotAdmin) {
        console.log(`🚨 BOT REMOVED: ${sender}`);

        await conn.groupParticipantsUpdate(m.chat, [sender], 'remove');
        await conn.sendMessage(m.chat, {
          text: `🚫 *BOT REMOVED!*\nUser @${sender.split('@')[0]} reached 5 suspected messages.`,
          mentions: [sender]
        });

        delete botMessageCount[sender];
      } else {
        await m.reply('⚠️ I am not an admin, so I cannot remove bots.');
      }
    }
  }
});
