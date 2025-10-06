const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');
const config = require('../config');

const STATE_PATH = path.join(__dirname, '../data/ownerReact.json');
let ownerReactState = { enabled: true, emoji: '🌹' };

try {
    if (fs.existsSync(STATE_PATH)) {
        ownerReactState = JSON.parse(fs.readFileSync(STATE_PATH, 'utf-8'));
    } else {
        fs.writeFileSync(STATE_PATH, JSON.stringify(ownerReactState, null, 2));
    }
} catch (e) {
    console.error('❌ ownerReact.json read/write error:', e.message);
}

const OWNER_NUMBER = (config.OWNER_NUMBER || '923276650623').replace(/[^0-9]/g, '');

cmd({
    pattern: 'ownerreact',
    desc: 'Owner ke liye auto react system',
    category: 'owner',
    react: '🌹',
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const sender = (mek.sender || '').replace(/[^0-9]/g, '');
        if (sender !== OWNER_NUMBER) return reply('❌ Ye command sirf *Owner* use kar sakta hai.');

        const args = m.text?.split(/\s+/) || [];
        const action = args[1]?.toLowerCase();

        if (action === 'set' && args[2]) {
            ownerReactState.emoji = args[2];
            fs.writeFileSync(STATE_PATH, JSON.stringify(ownerReactState, null, 2));
            return reply(`✅ Emoji set ho gaya ${ownerReactState.emoji} pe`);
        }

        if (action === 'on') {
            ownerReactState.enabled = true;
            fs.writeFileSync(STATE_PATH, JSON.stringify(ownerReactState, null, 2));
            return reply('✅ Owner React ab *ON* hai');
        }

        if (action === 'off') {
            ownerReactState.enabled = false;
            fs.writeFileSync(STATE_PATH, JSON.stringify(ownerReactState, null, 2));
            return reply('✅ Owner React ab *OFF* hai');
        }

        ownerReactState.enabled = !ownerReactState.enabled;
        fs.writeFileSync(STATE_PATH, JSON.stringify(ownerReactState, null, 2));
        reply(`✅ Owner React ab *${ownerReactState.enabled ? 'ON' : 'OFF'}* hai`);
    } catch (err) {
        console.error('❌ Error in ownerreact:', err.message);
        reply('⚠️ Kuch ghalat ho gaya, dubara koshish karo.');
    }
});

cmd({
    on: 'message'
}, async (conn, mek) => {
    try {
        if (!ownerReactState.enabled) return;

        const senderJid = mek.key.participant || mek.participant || mek.key.remoteJid;
        const senderNum = (senderJid || '').replace(/[^0-9]/g, '');
        const fromMe = mek.key.fromMe;

        if (fromMe || senderNum === OWNER_NUMBER) {
            await conn.sendMessage(mek.key.remoteJid, {
                react: { text: ownerReactState.emoji, key: mek.key }
            });
        }
    } catch (err) {
        console.error('❌ Auto react error:', err.message);
    }
});
