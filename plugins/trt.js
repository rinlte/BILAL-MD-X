const axios = require('axios');
const config = require('../config')
const {cmd , commands} = require('../command')
const googleTTS = require('google-tts-api')

cmd({
    pattern: "trt",
    alias: ["translate"],
    desc: "🌍 Translate text between languages",
    react: "🌹",
    category: "other",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        const args = q.split(' ');
        if (args.length < 2) return reply("*AP KO KISI KE MSG KI LANGUAGE SAMAJH NAHI AA RH 🤔* \n *TO ESE LIKHO ☺️🌹* \n *❮.TRT UR❯ WO MSG PASTE KRO ☺️🌹* \");

        const targetLang = args[0];
        const textToTranslate = args.slice(1).join(' ');

        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=en|${targetLang}`;

        const response = await axios.get(url);
        const translation = response.data.responseData.translatedText;

        const translationMessage = `*👑 BILAL-MD WHATSAPP BOT 👑*

*APKA MSG:❯* ${textToTranslate}

*TRANSLATED:❯* ${translation}

*LANGUAGE:❯* ${targetLang.toUpperCase()}`;

        return reply(translationMessage);
    } catch (e) {
        console.log(e);
        return reply("⚠️ An error occurred data while translating the your text. Please try again later🤕");
    }
});
