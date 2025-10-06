const fs = require('fs');
const path = require('path');
const { cmd } = require('../command');

const BAN_FILE = path.join(__dirname, '../data/banned.json');

// ✅ Load or create ban file
let banned = [];
if (fs.existsSync(BAN_FILE)) {
  try {
    banned = JSON.parse(fs.readFileSync(BAN_FILE, 'utf8'));
  } catch (e) {
    console.error('❌ Error reading banned.json:', e);
  }
} else {
  fs.writeFileSync(BAN_FILE, JSON.stringify([], null, 2));
}

// ✅ Helper function
const saveBanned = () => fs.writeFileSync(BAN_FILE, JSON.stringify(banned, null, 2));

// ✅ Ban command
cmd({
  pattern: "ban",
  desc: "Ban a user from using the bot",
  category: "admin",
  use: "<reply or mention>",
  fromMe: true
}, async (m, { conn, text }) => {
  const target = m.mentionedJid?.[0] || m.reply_message?.sender || text?.replace(/[^0-9]/g, '');
  if (!target) return await m.reply("⚠️ Reply or mention someone to ban.");

  const number = target.replace(/[^0-9]/g, '');
  if (banned.includes(number)) return await m.reply("🚫 User is already banned.");

  banned.push(number);
  saveBanned();
  await m.reply(`🚫 @${number} has been *banned* from using the bot.`, { mentions: [target + '@s.whatsapp.net'] });
});

// ✅ Unban command
cmd({
  pattern: "unban",
  desc: "Unban a banned user",
  category: "admin",
  use: "<reply or mention>",
  fromMe: true
}, async (m, { conn, text }) => {
  const target = m.mentionedJid?.[0] || m.reply_message?.sender || text?.replace(/[^0-9]/g, '');
  if (!target) return await m.reply("⚠️ Reply or mention someone to unban.");

  const number = target.replace(/[^0-9]/g, '');
  if (!banned.includes(number)) return await m.reply("✅ User is not banned.");

  banned = banned.filter(n => n !== number);
  saveBanned();
  await m.reply(`✅ @${number} has been *unbanned*.`, { mentions: [target + '@s.whatsapp.net'] });
});

// ✅ Auto check before executing any command
cmd({
  on: 'body'
}, async (conn, mek, m) => {
  try {
    const sender = (m.key?.participant || m.key?.remoteJid || '').split('@')[0];
    if (banned.includes(sender)) {
      return await conn.sendMessage(m.chat, { text: "🚫 You are banned from using this bot." }, { quoted: m });
    }
  } catch (err) {
    console.error("Error checking banned user:", err);
  }
});
