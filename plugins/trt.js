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
        // 🔹 Guide message (jab command sirf call ki jaye, bina args)
        const guideMsg =
`\n*_________________________________________*
*APKO KISI LANGUAGE KI SAMAJH NAHI AA RAHI TO AP YEH TRICK USE KARO 😃* 
 *TO AP ESE LIKHO ☺️* 
*_________________________________________*
 *TRT UR ❮URDU LANGUAGE ME TRANSLATE KARNE K LIE❯* 
*_________________________________________*
 *TRT EN ❮ENGLISH ME TRANSLATE KARNE K LIE❯* 
*_________________________________________*
 *APKE PASS AGAR ENGLISH ZUBAN KA MSG HAI AUR AP NE USE URDU ME TRANSLATE KARNA HAI 🤔* 
 *TO ESE LIKHO ☺️* 
*_________________________________________*
 *TRT UR ❮APNA ENGLISH WALA MSG YAHA LIKHO❯* 
*_________________________________________*
 *AGAR APKE PASS URDU WALA MSG HAI AUR AP NE ENGLISH ME TRANSLATE KARNA HAI 🤔* 
 *TO AP ESE LIKHO ☺️* 
*_________________________________________*
 *TRT EN ❮APNA URDU WALA MSG YAHA LIKHO❯* 
*_________________________________________*
 *AB TO APKO SAMAJH AA GAI HOGI ☺️🌹* 
*_________________________________________*
 *👑 BILAL-MD WHATSAPP BOT 👑* 
*_________________________________________*`;

        // 🔹 Wrong command message (jab user galat/incomplete likhe)
        const wrongCmdMsg =
`\n*_________________________________________*
*LAGTA HAI APNE GALAT LIKHA HAI 🥺* 
*_________________________________________*
 *AP YEH NICHE DHYAN SE MSG PRHO AUR FIR DUBARA SAHI SE LIKHO ☺️🌹*  
*_________________________________________*
*APKO KISI LANGUAGE KI SAMAJH NAHI AA RAHI YEH TRICK USE KARO 😃* 
 *TO AP ESE LIKHO ☺️* 
*_________________________________________*
 *TRT UR ❮URDU LANGUAGE ME TRANSLATE KARNE K LIE❯* 
*_________________________________________*
 *TRT EN ❮ENGLISH ME TRANSLATE KARNE K LIE❯* 
*_________________________________________*
 *APKE PASS AGAR ENGLISH ZUBAN KA MSG HAI AUR AP NE USE URDU ME TRANSLATE KARNA HAI 🤔* 
 *TO ESE LIKHO ☺️* 
*_________________________________________*
 *TRT UR ❮APNA ENGLISH WALA MSG YAHA LIKHO❯* 
*_________________________________________*
 *AGAR APKE PASS URDU WALA MSG HAI AUR AP NE ENGLISH ME TRANSLATE KARNA HAI 🤔* 
 *TO AP ESE LIKHO ☺️* 
*_________________________________________*
 *TRT EN ❮APNA URDU WALA MSG YAHA LIKHO❯* 
*_________________________________________*
 *AB TO APKO SAMAJH AA GAI HOGI ☺️🌹* 
*_________________________________________*
 *👑 BILAL-MD WHATSAPP BOT 👑* 
*_________________________________________*`;

        // --- BEHAVIOUR FIX: only send guideMsg if there are NO args at all.
        // If user provided args but format is wrong (e.g., less than 2 parts),
        // send only wrongCmdMsg so they don't merge.

        // case: user typed just ".trt" (no q) => show guide
        if (!q || q.trim().length === 0) {
            await conn.sendMessage(from, { react: { text: '🥺', key: m.key } });
            return reply(guideMsg);
        }

        // user provided something; check parts
        const parts = q.trim().split(/\s+/);
        if (parts.length < 2) {
            // provided something but format incomplete -> wrongCmdMsg only
            await conn.sendMessage(from, { react: { text: '😫', key: m.key } });
            return reply(wrongCmdMsg);
        }

        // --- proceed with translation as before
        const argsArr = parts;
        const targetLang = argsArr[0].toLowerCase();
        const textToTranslate = argsArr.slice(1).join(' ');

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
