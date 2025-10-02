const googleTTS = require("google-tts-api");
const franc = require("franc-min");
const { cmd } = require('../command');

cmd({
    pattern: "ttx",
    desc: "Convert text to speech (Auto-Detect + Multi-Language)",
    category: "tools",
    react: "😇",
    filename: __filename
},
async (conn, mek, m, { from, reply, q, args }) => {
    try {
        if (!q) {
            return reply(
                "*❌ Example:* \n" +
                "tts en Hello how are you?\n" +
                "tts ur Tum kahan ho?\n" +
                "tts Namaste doston (auto-detect)\n\n" +
                "*🌍 Supported lang codes:* en, ur, hi, ar, es, fr, de ..."
            );
        }

        let lang, text;

        // Agar pehle arg 2-letter code ho to lang fix kar do
        if (args.length > 1 && args[0].length === 2) {
            lang = args[0].toLowerCase();
            text = args.slice(1).join(" ");
        } else {
            // Auto Detect Language
            text = q;
            const detect = franc(text);
            // franc sometimes gives 3-letter ISO codes, convert manually
            const mapLang = {
                hin: "hi", urd: "ur", eng: "en", spa: "es",
                fra: "fr", deu: "de", arb: "ar", ben: "bn",
                rus: "ru", jpn: "ja", ita: "it", tur: "tr"
            };
            lang = mapLang[detect] || "en"; // default English if unknown
        }

        if (!text) return reply("❌ Please provide text.");

        // Generate TTS Audio
        const url = googleTTS.getAudioUrl(text, {
            lang: lang,
            slow: false,
            host: "https://translate.google.com",
        });

        // Send as Voice Note
        await conn.sendMessage(from, {
            audio: { url: url },
            mimetype: "audio/mpeg",
            ptt: true
        }, { quoted: mek });

    } catch (e) {
        reply("❌ Error: " + e.message);
    }
});
