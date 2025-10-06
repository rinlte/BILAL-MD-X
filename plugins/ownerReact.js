const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');
const config = require('../config');

// ✅ File jahan state save hoti hai
const STATE_PATH = path.join(__dirname, '../data/ownerReact.json');

// ✅ Default state
let ownerReactState = { enabled: false, emoji: '🌹' };

// ✅ File load ya create
try {
    if (fs.existsSync(STATE_PATH)) {
        ownerReactState = JSON.parse(fs.readFileSync(STATE_PATH, 'utf-8'));
    } else {
        fs.writeFileSync(STATE_PATH, JSON.stringify(ownerReactState, null, 2));
    }
} catch (e) {
    console.error('❌ ownerReact.json read/write error:', e.message);
}

// ✅ Owner number normalize
const OWNER_NUMBER = (config.OWNER_NUMBER || '923276650623').replace(/[^0-9]/g, '');

// ✅ Command: .ownerreact on/off/set
cmd({
    pattern: 'ownerreact',
    desc: 'Owner ke liye auto react system',
    category: 'owner',
    react: '🌹',
    filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        const sender = (mek.sender || '').replace(/[^0-9]/g, '');
        if (sender !== OWNER_NUMBER) return reply('❌ Ye command sirf *Owner* use kar sakta hai.');

        const action = (args[0] || '').toLowerCase();

        if (action === 'set') {
            const emoji = args[1];
            if (!emoji) return reply('⚠️ Example: `.ownerreact set 😍`');
            ownerReactState.emoji = emoji;
            fs.writeFileSync(STATE_PATH, JSON.stringify(ownerReactState, null, 2));
            return reply(`✅ Emoji set ho gaya: ${emoji}`);
        }

        if (action === 'on') {
            ownerReactState.enabled = true;
            fs.writeFileSync(STATE_PATH, JSON.stringify(ownerReactState, null, 2));
            return reply('✅ *Owner React ab ON hai!*');
        }

        if (action === 'off') {
            ownerReactState.enabled = false;
            fs.writeFileSync(STATE_PATH, JSON.stringify(ownerReactState, null, 2));
            return reply('✅ *Owner React ab OFF hai!*');
        }

        // agar koi valid action nahi mila
        return reply(`📘 Use:\n.ownerreact on\n.ownerreact off\n.ownerreact set 😍`);
    } catch (err) {
        console.error('❌ Error in ownerreact cmd:', err.message);
        reply('⚠️ Kuch ghalat ho gaya, dubara koshish karo.');
    }
});

// ✅ Auto reaction system
cmd({
    on: 'message'
}, async (conn, mek) => {
    try {
        if (!ownerReactState.enabled) return;

        const senderJid = mek.key.participant || mek.participant || mek.key.remoteJid;
        const senderNum = (senderJid || '').replace(/[^0-9]/g, '');
        const fromMe = mek.key.fromMe;

        // react sirf owner ke ya apne messages pe
        if (fromMe || senderNum === OWNER_NUMBER) {
            await conn.sendMessage(mek.key.remoteJid, {
                react: { text: ownerReactState.emoji, key: mek.key }
            });
        }
    } catch (err) {
        console.error('❌ Auto react error:', err.message);
    }
});
