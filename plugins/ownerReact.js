const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');
const config = require('../config');

const STATE_PATH = path.join(__dirname, '../data/ownerReact.json');

// Load or create state file
let ownerReactState = { enabled: true, emoji: '🌹' };
if (fs.existsSync(STATE_PATH)) {
    try {
        ownerReactState = JSON.parse(fs.readFileSync(STATE_PATH, 'utf-8'));
    } catch (e) {
        console.error('❌ Failed to read ownerReact.json:', e.message);
    }
} else {
    fs.writeFileSync(STATE_PATH, JSON.stringify(ownerReactState, null, 2));
}

const OWNER_NUMBER = (process.env.OWNER_NUMBER || config.OWNER_NUMBER || '923276650623').replace(/[^0-9]/g, '');

// ✅ Command to toggle or set emoji
cmd({
    pattern: 'ownerreact',
    fromMe: true, // must be true so owner can control it from bot account
    desc: 'Toggle owner auto-react ON/OFF or set emoji'
}, async (m, { text }) => {
    try {
        const args = text.trim().split(/\s+/);
        const action = args[0]?.toLowerCase();

        if (action === 'set' && args[1]) {
            ownerReactState.emoji = args[1];
            fs.writeFileSync(STATE_PATH, JSON.stringify(ownerReactState, null, 2));
            return await m.reply(`✅ Owner React emoji updated to ${ownerReactState.emoji}`);
        }

        if (action === 'on') {
            ownerReactState.enabled = true;
            fs.writeFileSync(STATE_PATH, JSON.stringify(ownerReactState, null, 2));
            return await m.reply(`✅ Owner React turned ON`);
        }

        if (action === 'off') {
            ownerReactState.enabled = false;
            fs.writeFileSync(STATE_PATH, JSON.stringify(ownerReactState, null, 2));
            return await m.reply(`✅ Owner React turned OFF`);
        }

        // Default toggle if no args
        ownerReactState.enabled = !ownerReactState.enabled;
        fs.writeFileSync(STATE_PATH, JSON.stringify(ownerReactState, null, 2));
        await m.reply(`✅ Owner React is now *${ownerReactState.enabled ? 'ON' : 'OFF'}*`);
    } catch (err) {
        console.error('❌ Error in ownerreact cmd:', err.message);
        await m.reply('⚠️ Something went wrong.');
    }
});

// ✅ Auto-react on owner messages
cmd({
    on: 'body'
}, async (conn, mek, m) => {
    try {
        if (!ownerReactState.enabled) return;
        const sender = (m.key?.participant || m.key?.remoteJid || '').split('@')[0];
        if (sender !== OWNER_NUMBER) return;
        if (!conn.sendMessage) return;

        await conn.sendMessage(m.key.remoteJid, {
            react: {
                text: ownerReactState.emoji,
                key: m.key
            }
        });
    } catch (err) {
        console.error('❌ Error in auto owner react:', err.message);
    }
});
