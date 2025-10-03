const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');
const gTTS = require('gtts');

cmd({
    pattern: "tts",
    alias: ["voice", "speak", "bolo", "awaz"], // 👈 aliases add kiye
    desc: "Convert text to speech",
    category: "tools",
    use: "<lang> <text>",
    react: "🎤",   // 👈 react emoji
    filename: __filename
}, async (conn, mek, m, { args, reply }) => {
    try {
        if (!args[0]) return reply("⚠️ Example: .tts en Hello World");

        const lang = args[0];
        const text = args.slice(1).join(" ");
        if (!text) return reply("⚠️ Please provide text after language.\n\nExample: `.tts en Assalamu Alaikum`");

        const fileName = `tts-${Date.now()}.mp3`;
        const filePath = path.join(__dirname, '..', 'voices', fileName);

        const gtts = new gTTS(text, lang);
        gtts.save(filePath, async function (err) {
            if (err) {
                reply("❌ Error generating TTS audio.");
                return;
            }

            await conn.sendMessage(m.chat, {
                audio: fs.readFileSync(filePath),
                mimetype: 'audio/mpeg',
                ptt: true // 👈 voice note style
            }, { quoted: mek });

            fs.unlinkSync(filePath);
        });

    } catch (e) {
        reply("❌ Error: " + e.message);
    }
});
