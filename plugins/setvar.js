const { cmd } = require('../command');
const axios = require('axios');

const HEROKU_API_KEY = process.env.HEROKU_API_KEY;
const HEROKU_APP_NAME = process.env.HEROKU_APP_NAME;

cmd({
    pattern: 'setvar',
    alias: ['setenv', 'envset'],
    desc: 'Set or update Heroku config vars directly from WhatsApp',
    category: 'owner',
    react: '⚙️',
    filename: __filename
}, async (conn, mek, m, { from, sender, reply, isCreator }) => {
    try {
        console.log('💡 setvar command triggered by', sender);

        if (!isCreator) {
            console.log('⛔ Not owner');
            return reply('⚠️ Sirf bot owner is command ka use kar sakta hai.');
        }

        if (!HEROKU_API_KEY || !HEROKU_APP_NAME) {
            console.log('❌ Missing Heroku credentials');
            return reply('❌ Heroku API key ya App name set nahi hai.\n\nSet karo pehle:\nHEROKU_API_KEY & HEROKU_APP_NAME');
        }

        const input = m.text.split(' ').slice(1).join(' ');
        if (!input || !input.includes('=')) {
            console.log('⚠️ Invalid input');
            return reply('📘 Example:\n.setvar API_KEY=12345');
        }

        const [key, value] = input.split('=');
        if (!key || !value) {
            console.log('⚠️ Missing key/value');
            return reply('❌ Format ghalat hai.\nExample: `.setvar NAME=VALUE`');
        }

        await conn.sendPresenceUpdate('composing', from);

        const url = `https://api.heroku.com/apps/${HEROKU_APP_NAME}/config-vars`;
        console.log('🌐 Sending PATCH to:', url);

        const res = await axios.patch(
            url,
            { [key.trim()]: value.trim() },
            {
                headers: {
                    Accept: 'application/vnd.heroku+json; version=3',
                    Authorization: `Bearer ${HEROKU_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('✅ Response:', res.status, res.data);

        await conn.sendPresenceUpdate('paused', from);
        await reply(`✅ *Successfully set Heroku var:*\n\n${key.trim()} = ${value.trim()}`);
        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error('❌ Error in setvar:', err.response?.data || err.message);
        await conn.sendPresenceUpdate('paused', from);
        await conn.sendMessage(from, { react: { text: '😔', key: m.key } });
        reply(`⚠️ Error: ${err.response?.data?.message || err.message}`);
    }
});
