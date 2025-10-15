const axios = require('axios');
const config = require('../config')
const {cmd , commands} = require('../command')
const googleTTS = require('google-tts-api')

cmd({
    pattern: "trt",
    alias: ["translate"],
    desc: "🌍 Translate text between languages",
    react: "🥺",
    category: "other",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        const args = q.split(' ');
        if (args.length < 2) return reply("\n*_________________________________________*\n*APKO KISI LANGUAGE KI SAMAJH NAHI AA RAHI YEH TRICK USE KARO 🥺* \n *TO AP ESE LIKHO ☺️* \n*_________________________________________*\n *TRT UR ❮URDU LANGUAGE ME TRANSLATE KARNE K LIE❯* \n*_________________________________________*\n *TRT EN ❮ENGLISH ME TRANSLATE KARNE K LIE❯* \n*_________________________________________*\n *APKE PASS AGAR ENGLISH ZUBAN KA MSG HAI AP NE USE URDU ME TRANSLATE KARNA HAI 🤔* \n *TO ESE LIKHO ☺️* \n*_________________________________________*\n *TRT UR ❮APNA ENGLISH WALA MSG YAHA LIKHO❯* \n*_________________________________________*\n *AGAR APKE PASS URDU WALA MSG HAI AUR AP NE ENGLISH ZUBAN ME TRANSLATE KARNA HAI 🤔* \n *TO AP ESE LIKHO ☺️* \n*_________________________________________*\n *TRT EN ❮APNA URDU WALA MSG YAHA LIKHO❯* \n*_________________________________________*\n *AB TO APKO SAMAJH AA GAI HOGI ☺️🌹* \n*_________________________________________*\n *👑 BILAL-MD WHATSAPP BOT 👑* \n*_________________________________________*\n");

        const targetLang = args[0];
        const textToTranslate = args.slice(1).join(' ');

        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=en|${targetLang}`;

        const response = await axios.get(url);
        const translation = response.data.responseData.translatedText;

        const translationMessage = `> *BILAL-TRANSLATION*

> 🔤 *Original*: ${textToTranslate}

> 🔠 *Translated*: ${translation}

> 🌐 *Language*: ${targetLang.toUpperCase()}`;

        return reply(translationMessage);
    } catch (e) {
        console.log(e);
        return reply("⚠️ An error occurred data while translating the your text. Please try again later🤕");
    }
});

//____________________________TTS___________________________
