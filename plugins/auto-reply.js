const fs = require('fs');
const path = require('path');
const { cmd, commands } = require('../command');
const config = require('../config');

// Path to local autoreply JSON
const AUTOREPLY_PATH = path.join(__dirname, '../data/autoreply.json');

// Read and parse JSON synchronously
let autoReplies = {};
try {
    const rawData = fs.readFileSync(AUTOREPLY_PATH, 'utf-8');
    autoReplies = JSON.parse(rawData);
} catch (err) {
    console.error('ERROR reading autoreply.json:', err.message);
}

cmd({
    on: "body"
}, async (conn, mek, m, { body }) => {
    try {
        if (!body) return;
        for (const text in autoReplies) {
            if (body.toLowerCase() === text.toLowerCase()) {
                if (config.AUTO_REPLY === 'true') {
                    await m.reply(autoReplies[text]);
                }
                break;
            }
        }
    } catch (err) {
        console.error('ERROR replying:', err.message);
    }
});
