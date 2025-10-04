const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');
const config = require('../config');

// Path to store owner react state
const STATE_PATH = path.join(__dirname, '../data/ownerReact.json');

// Load or create state
let ownerReactState = { enabled: true, emoji: '🌹' }; // default emoji
if (fs.existsSync(STATE_PATH)) {
    try {
        ownerReactState = JSON.parse(fs.readFileSync(STATE_PATH, 'utf-8'));
    } catch (e) {
        console.error('❌ ERROR reading ownerReact.json:', e.message);
    }
} else {
    fs.writeFileSync(STATE_PATH, JSON.stringify(ownerReactState));
}

// Owner number from Heroku vars or config
const OWNER_NUMBER = process.env.OWNER_NUMBER || config.OWNER_NUMBER || '923276650623';

// Command: Toggle ON/OFF or Set Emoji
cmd({
    pattern: 'ownerreact',
    fromMe: false,
    desc: 'Toggle owner react ON/OFF or set emoji'
}, async (m, { args }) => {
    try {
        const sender = m.key.remoteJid.split('@')[0];
        if (sender !== OWNER_NUMBER) return; // Only owner can use

        if (args[0]) {
            const arg = args[0].toLowerCase();
            if (arg === 'set' && args[1]) {
                // Set new emoji
                ownerReactState.emoji = args[1];
                fs.writeFileSync(STATE_PATH, JSON.stringify(ownerReactState));
                await m.reply(`✅ Owner React emoji updated to: ${ownerReactState.emoji}`);
                return;
            }
            if (arg === 'on') {
                ownerReactState.enabled = true;
                fs.writeFileSync(STATE_PATH, JSON.stringify(ownerReactState));
                await m.reply(`✅ Owner React is now ON`);
                return;
            }
            if (arg === 'off') {
                ownerReactState.enabled = false;
                fs.writeFileSync(STATE_PATH, JSON.stringify(ownerReactState));
                await m.reply(`✅ Owner React is now OFF`);
                return;
            }
        }

        // Default toggle if no argument
        ownerReactState.enabled = !ownerReactState.enabled;
        fs.writeFileSync(STATE_PATH, JSON.stringify(ownerReactState));
        await m.reply(`✅ Owner React is now *${ownerReactState.enabled ? 'ON' : 'OFF'}*`);

    } catch (e) {
        console.error('❌ ERROR updating owner react:', e.message);
        await m.reply('⚠️ Something went wrong!');
    }
});

// React handler: Owner messages only
cmd({
    on: 'body'
}, async (conn, mek, m) => {
    try {
        if (!ownerReactState.enabled) return;

        const sender = m.key.remoteJid.split('@')[0];
        if (sender !== OWNER_NUMBER) return;

        if (!conn.sendMessage) return;

        await conn.sendMessage(m.key.remoteJid, {
            react: {
                text: ownerReactState.emoji, // updated emoji will be used
                key: m.key
            }
        });
    } catch (err) {
        console.error('❌ ERROR in owner react:', err.message);
    }
});
