const fs = require('fs');
const { cmd } = require('../command');
const filePath = './plugins/antibot-status.json';

// Create antibot status file if it doesn't exist
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({ enabled: false }, null, 2));
}

// Load antibot status
let antibotStatus = JSON.parse(fs.readFileSync(filePath));

// Save function
function saveStatus() {
    fs.writeFileSync(filePath, JSON.stringify(antibotStatus, null, 2));
}

// Message counter for detected bots
let botMessageCount = {};

module.exports = {
    // ===============================
    // COMMAND HANDLER: antibot on/off
    // ===============================
    async command(m, { text, conn }) {
        const args = text.trim().toLowerCase();

        if (args === 'on') {
            antibotStatus.enabled = true;
            saveStatus();
            await conn.sendMessage(m.chat, { text: '✅ AntiBot is now *ON*! Bots will be detected and removed automatically.' });
        } 
        else if (args === 'off') {
            antibotStatus.enabled = false;
            saveStatus();
            await conn.sendMessage(m.chat, { text: '🚫 AntiBot is now *OFF*! Bot messages will not be monitored.' });
        } 
        else {
            await conn.sendMessage(m.chat, {
                text: `⚙️ *Usage:*\n> antibot on\n> antibot off\n\n*Current status:* ${antibotStatus.enabled ? '✅ ON' : '❌ OFF'}`
            });
        }
    },

    // ===============================
    // AUTO CHECK BEFORE MESSAGE HANDLE
    // ===============================
    async before(m, { conn, isAdmin, isBotAdmin }) {
        if (!m.isGroup) return !0;
        if (m.fromMe) return !0;

        // WhatsApp bot ID regex patterns
        const botPatterns = [
            /^3EBO/, /^4EBO/, /^5EBO/, /^6EBO/, /^7EBO/, /^8EBO/,
            /^9EBO/, /^AEBO/, /^BEBO/, /^CEBO/, /^DEBO/, /^EEBO/,
            /^FEBO/, /^ABE5/, /^BAE7/, /^CAEBO/, /^DAEBO/, /^FAEBO/
        ];

        // Only run if antibot is enabled
        if (!antibotStatus.enabled) return !0;

        // If message seems from a bot
        if (botPatterns.some(rx => rx.test(m.key.id)) && m.key.remoteJid.endsWith('@g.us')) {
            const sender = m.key.participant;
            botMessageCount[sender] = (botMessageCount[sender] || 0) + 1;

            console.log(`🤖 ${sender} has sent ${botMessageCount[sender]} suspected bot messages.`);

            if (botMessageCount[sender] >= 5) {
                if (isBotAdmin) {
                    console.log(`🚨 BOT REMOVED: ${sender}`);

                    // Remove the bot from group
                    await conn.groupParticipantsUpdate(m.chat, [sender], 'remove');

                    // Notify group
                    await conn.sendMessage(m.chat, {
                        text: `🚫 *BOT REMOVED!*\nUser @${sender.split('@')[0]} reached 5 suspected messages.`,
                        mentions: [sender]
                    });

                    // Reset message count
                    delete botMessageCount[sender];
                } else {
                    m.reply('⚠️ I am not an admin, so I cannot remove this bot.');
                }
            }
        }

        return !0;
    }
};
