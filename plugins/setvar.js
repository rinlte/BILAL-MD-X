const { cmd } = require('../command');
const axios = require('axios');

// Heroku credentials (environment variables)
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
        // Only bot owner can use
        if (!isCreator) return reply('⚠️ Sirf bot owner is command ka use kar sakta hai.');

        if (!HEROKU_API_KEY || !HEROKU_APP_NAME)
            return reply('❌ Heroku API key ya App name set nahi hai.\n\nSet karo pehle:\nHEROKU_API_KEY & HEROKU_APP_NAME');

        const input = m.text.split(' ').slice(1).join(' ');
        if (!input || !input.includes('=')) {
            return reply('📘 Example:\n.setvar API_KEY=12345');
        }

        // Extract key and value
        const [key, value] = input.split('=');
        if (!key || !value) return reply('❌ Format ghalat hai.\nExample: `.setvar NAME=VALUE`');

        await conn.sendPresenceUpdate('composing', from);

        // API URL
        const url = `https://api.heroku.com/apps/${HEROKU_APP_NAME}/config-vars`;

        // Update var
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

        await conn.sendPresenceUpdate('paused', from);
        await reply(`✅ Successfully set Heroku var:\n\n*${key.trim()} = ${value.trim()}*`);
        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error('❌ Error setting var:', err.message);
        await conn.sendPresenceUpdate('paused', from);
        await conn.sendMessage(from, { react: { text: '😔', key: m.key } });
        reply(`⚠️ Error: ${err.message}`);
    }
});
