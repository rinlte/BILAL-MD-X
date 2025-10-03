const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');
const config = require('../config');

// Path to store owner react state
const STATE_PATH = path.join(__dirname, '../data/ownerReact.json');

// Load state
let ownerReactState = { enabled: true, emoji: '🥰' };
if (fs.existsSync(STATE_PATH)) {
    try {
        ownerReactState = JSON.parse(fs.readFileSync(STATE_PATH, 'utf-8'));
    } catch (e) {
        console.error('❌ ERROR reading ownerReact.json:', e.message);
    }
} else {
    fs.writeFileSync(STATE_PATH, JSON.stringify(ownerReactState));
}

// Owner number from env or config
const OWNER_NUMBER = process.env.OWNER_NUMBER || config.OWNER_NUMBER || '923276650623';

// Toggle ON/OFF command
cmd({
    pattern: 'ownerreact',
    fromMe: true,
    desc: 'Toggle owner react ON/OFF or set emoji'
}, async (m, { conn, args }) => {
    try {
        if (args[0] && args[0].toLowerCase() === 'set' && args[1]) {
            // Set new emoji
            ownerReactState.emoji = args[1];
            fs.writeFileSync(STATE_PATH, JSON.stringify(ownerReactState));
            await m.reply(`✅ Owner React emoji set to: ${ownerReactState.emoji}`);
        } else {
            // Toggle ON/OFF
            ownerReactState.enabled = !ownerReactState.enabled;
            fs.writeFileSync(STATE_PATH, JSON.stringify(ownerReactState));
            await m.reply(`✅ Owner React is now *${ownerReactState.enabled ? 'ON' : 'OFF'}*`);
        }
    } catch (e) {
        console.error('❌ ERROR updating owner react:', e.message);
        await m.reply('⚠️ Something went wrong!');
    }
});

// Actual owner react handler
cmd({
    on: 'body'
}, async (conn, mek, m) => {
    try {
        if (!ownerReactState.enabled) return;

        const sender = m.key?.fromMe ? OWNER_NUMBER : m.key?.remoteJid?.split('@')[0];
        if (sender !== OWNER_NUMBER) return;

        if (!conn.sendMessage) return;

        await conn.sendMessage(m.key.remoteJid, {
            react: {
                text: ownerReactState.emoji,
                key: m.key
            }
        });
    } catch (err) {
        console.error('❌ ERROR in owner react:', err.message);
    }
});
