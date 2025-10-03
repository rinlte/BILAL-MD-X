const fs = require('fs');
const path = require('path');
const { cmd, commands } = require('../command');
const config = require('../config');

// Path to local autoreply JSON
const AUTOREPLY_PATH = path.join(__dirname, '../data/autoreply.json');

let autoReplies = {};

// Function to load JSON file
function loadAutoReplies() {
    try {
        const rawData = fs.readFileSync(AUTOREPLY_PATH, 'utf-8');
        autoReplies = JSON.parse(rawData);
        console.log('✅ Auto-replies loaded successfully');
    } catch (err) {
        console.error('❌ ERROR reading autoreply.json:', err.message);
        autoReplies = {};
    }
}

// Initial load
loadAutoReplies();

// Watch file for changes (hot-reload)
fs.watchFile(AUTOREPLY_PATH, (curr, prev) => {
    if (curr.mtime !== prev.mtime) {
        console.log('♻️ autoreply.json updated, reloading...');
        loadAutoReplies();
    }
});

// Auto-reply message handler
cmd({
    on: "body"
}, async (conn, mek, m, { body }) => {
    try {
        if (!body) return;

        // React to incoming message (optional)
        if (config.AUTO_REPLY === 'true' && m.key && conn.sendMessage) {
            await conn.sendMessage(m.key.remoteJid, { react: { text: "🌹", key: m.key } });
        }

        // Process auto-reply
        for (const text in autoReplies) {
            if (body.toLowerCase() === text.toLowerCase()) {
                if (config.AUTO_REPLY === 'true') {
                    await m.reply(autoReplies[text]);
                } else {
                    await m.reply("⚠️ Auto-reply is OFF. Send *!autoreply on* to enable.");
                }
                break;
            }
        }
    } catch (err) {
        console.error('❌ ERROR replying:', err.message);
        await m.reply("*DUBARA KOSHISH KARO 🥺❤️*");
    }
});
