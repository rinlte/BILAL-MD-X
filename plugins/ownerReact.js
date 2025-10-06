const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');
const config = require('../config');

// ✅ File jahan setting save hogi
const STATE_PATH = path.join(__dirname, '../data/ownerReact.json');

// ✅ Default state
let ownerReactState = { enabled: true, emoji: '🌹' };

// ✅ File load ya create
try {
    if (fs.existsSync(STATE_PATH)) {
        ownerReactState = JSON.parse(fs.readFileSync(STATE_PATH, 'utf-8'));
    } else {
        fs.writeFileSync(STATE_PATH, JSON.stringify(ownerReactState, null, 2));
    }
} catch (e) {
    console.error('❌ Failed to read/write ownerReact.json:', e.message);
}

// ✅ Owner number (change kar sakte ho)
const OWNER_NUMBER = (process.env.OWNER_NUMBER || config.OWNER_NUMBER || '923276650623').replace(/[^0-9]/g, '');

// ✅ Command: ownerreact (sirf owner ke liye)
cmd({
    pattern: 'ownerreact',
    desc: 'Toggle owner auto-react ON/OFF or set emoji'
}, async (message, match) => {
    try {
        const sender = (message.sender || '').replace(/[^0-9]/g, '');
        if (sender !== OWNER_NUMBER) {
            return await message.reply('❌ Ye command sirf *Owner* use kar sakta hai.');
        }

        const args = match.trim().split(/\s+/);
        const action = args[0]?.toLowerCase();

        if (action === 'set' && args[1]) {
            ownerReactState.emoji = args[1];
            fs.writeFileSync(STATE_PATH, JSON.stringify(ownerReactState, null, 2));
            return await message.reply(`✅ Owner React emoji update ho gaya ${ownerReactState.emoji} pe`);
        }

        if (action === 'on') {
            ownerReactState.enabled = true;
            fs.writeFileSync(STATE_PATH, JSON.stringify(ownerReactState, null, 2));
            return await message.reply('✅ Owner React ab *ON* hai');
        }

        if (action === 'off') {
            ownerReactState.enabled = false;
            fs.writeFileSync(STATE_PATH, JSON.stringify(ownerReactState, null, 2));
            return await message.reply('✅ Owner React ab *OFF* hai');
        }

        // Agar kuch nahi diya to toggle karega
        ownerReactState.enabled = !ownerReactState.enabled;
        fs.writeFileSync(STATE_PATH, JSON.stringify(ownerReactState, null, 2));
        await message.reply(`✅ Owner React ab *${ownerReactState.enabled ? 'ON' : 'OFF'}* hai`);

    } catch (err) {
        console.error('❌ Error in ownerreact cmd:', err.message);
        await message.reply('⚠️ Kuch ghalat ho gaya bhai, dubara koshish karo.');
    }
});

// ✅ Jab owner kisi bhi chat (group ya inbox) me message bheje to auto react kare
cmd({
    on: 'message'
}, async (conn, m) => {
    try {
        if (!ownerReactState.enabled) return;

        const fromMe = m.key.fromMe;
        const senderJid = m.participant || m.key.participant || m.key.remoteJid;
        const senderNum = (senderJid || '').replace(/[^0-9]/g, '');

        // ✅ Agar message owner ka hai (chahe fromMe ho ya participant)
        if (fromMe || senderNum === OWNER_NUMBER) {
            await conn.sendMessage(m.key.remoteJid, {
                react: {
                    text: ownerReactState.emoji,
                    key: m.key
                }
            });
        }
    } catch (err) {
        console.error('❌ Error in auto owner react:', err.message);
    }
});
