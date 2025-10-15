const axios = require('axios');
const config = require('../config');
const { cmd, commands } = require('../command');
const googleTTS = require('google-tts-api');

cmd({
    pattern: "trt",
    alias: ["translate"],
    desc: "🌍 Translate text between languages",
    react: "🥺", // default react when command runs
    category: "other",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        // 🔹 Guide message (used for both command start & wrong input)
        const guideMsg =
`\n*_________________________________________*
*APKO KISI LANGUAGE KI SAMAJH NAHI AA RAHI TO AP YEH TRICK USE KARO 🥺* 
 *TO AP ESE LIKHO ☺️* 
*_________________________________________*
 *TRT UR ❮URDU LANGUAGE ME TRANSLATE KARNE K LIE❯* 
*_________________________________________*
 *TRT EN ❮ENGLISH ME TRANSLATE KARNE K LIE❯* 
*_________________________________________*
 *APKE PASS AGAR ENGLISH ZUBAN KA MSG HAI AP NE USE URDU ME TRANSLATE KARNA HAI 🤔* 
 *TO ESE LIKHO ☺️* 
*_________________________________________*
 *TRT UR ❮APNA ENGLISH WALA MSG YAHA LIKHO❯* 
*_________________________________________*
 *AGAR APKE PASS URDU WALA MSG HAI AUR AP NE ENGLISH ZUBAN ME TRANSLATE KARNA HAI 🤔* 
 *TO AP ESE LIKHO ☺️* 
*_________________________________________*
 *TRT EN ❮APNA URDU WALA MSG YAHA LIKHO❯* 
*_________________________________________*
 *AB TO APKO SAMAJH AA GAI HOGI ☺️🌹* 
*_________________________________________*
 *👑 BILAL-MD WHATSAPP BOT 👑* 
*_________________________________________*`;

        // 🔹 Jab command likhi jaye (start message)
        await conn.sendMessage(from, { react: { text: '🥺', key: m.key } });
        await reply(guideMsg);

        // 🔹 Agar user ne kuch likha hi nahi ya galat likha
        if (!q || q.trim().split(' ').length < 2) {
            await conn.sendMessage(from, { react: { text: '😫', key: m.key } });
            return reply(guideMsg);
        }

        const args = q.split(' ');
        const targetLang = args[0].toLowerCase();
        const textToTranslate = args.slice(1).join(' ');

        // 🔹 API request
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=en|${targetLang}`;
        const response = await axios.get(url);

        if (!response.data || !response.data.responseData || !response.data.responseData.translatedText) {
            await conn.sendMessage(from, { react: { text: '😔', key: m.key } });
            return reply("*AP APNA TEXT MSG KO DUBARA TRANSLATE KARO 🥺*");
        }

        const translation = response.data.responseData.translatedText;

        const translationMessage = `> *👑 BILAL-TRANSLATION 👑*\n\n> 🔤 *Original*: ${textToTranslate}\n\n> 🔠 *Translated*: ${translation}\n\n> 🌐 *Language*: ${targetLang.toUpperCase()}`;

        await conn.sendMessage(from, { react: { text: '☺️', key: m.key } });
        return reply(translationMessage);

    } catch (e) {
        console.log("Translation Error:", e);
        await conn.sendMessage(from, { react: { text: '😔', key: m.key } });
        return reply("*AP APNA TEXT MSG KO DUBARA TRANSLATE KARO 🥺*");
    }
});
