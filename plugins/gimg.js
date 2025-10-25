const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "gimg",
    alias: ["googleimage", "img", "image", "pic", "photo", "searchimg"],
    react: "🖼️",
    desc: "Search Google Images using Dexter API",
    category: "search",
    use: ".gimg <query>",
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply("*AP NE KOI IMAGE SEARCH KARNI HAI 🥺*\n" +
        "*TO AP ESE LIKHO 😇*\n\n" +
        "*GIMG ❮APKE SEARCH KA NAM❯*\n\n" +
        "*AP COMMAND ❮GIMG❯ LIKH KAR USKE AGE APNA WORD LIKH DO ☺️ FIR WO IMAGE YAHA BHEJ DI JAYE GE 🥰💞*");

        const api = `https://api.id.dexter.it.com/search/google/image?q=${encodeURIComponent(q)}`;
        const { data: apiRes } = await axios.get(api);

        const results = apiRes.results || apiRes.data || apiRes.items || apiRes;
        if (!Array.isArray(results) || results.length === 0)
            return reply("*KOI IMAGE NAHI MILI 🥺 DUBARA TRY KARO ❤️*");

        const img = results[0].url || results[0].image || results[0].src || results[0];
        const img2 = results[1]?.url || results[1]?.image || results[1]?.src || results[1];

        const caption = `
        *__________________________________*
*👑 SEARCH KIYA GAYA :* ${q}
*__________________________________*
*👑 IMAGE SOURCE :* Google
*__________________________________*
*PEHLE IS MSG KO MENTION KARO 🥺 AUR PHIR AGAR NUMBER ❮1❯ LIKHO GE ☺️ TO NORMAL IMAGE AYE GE 🥰 AGAR NUMBER ❮2❯ LIKHO GE 🥺 TO DUSRI IMAGE AYE GE ☺️🌹*
*__________________________________*
*❮1❯ PEHLI IMAGE*
*__________________________________*
*❮2❯ DUSRI IMAGE*
*__________________________________*
*👑 BILAL-MD WHATSAPP BOT 👑*
*__________________________________*`;

        const sentMsg = await conn.sendMessage(from, {
            image: { url: img },
            caption
        }, { quoted: m });

        const messageID = sentMsg.key.id;

        conn.ev.on("messages.upsert", async (msgData) => {
            const receivedMsg = msgData.messages[0];
            if (!receivedMsg?.message) return;

            const receivedText = receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text;
            const senderID = receivedMsg.key.remoteJid;
            const isReplyToBot = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

            if (isReplyToBot) {
                await conn.sendMessage(senderID, { react: { text: '☺️', key: receivedMsg.key } });

                switch (receivedText.trim()) {
                    case "1":
                        await conn.sendMessage(senderID, {
                            image: { url: img },
                            caption: `🔍 ${q} (Image 1)`
                        }, { quoted: receivedMsg });
                        break;

                    case "2":
                        if (!img2) return reply("*DUSRI IMAGE NAHI MILI 🥺*");
                        await conn.sendMessage(senderID, {
                            image: { url: img2 },
                            caption: `🔍 ${q} (Image 2)`
                        }, { quoted: receivedMsg });
                        break;

                    default:
                        reply("*MERE MSG KO PEHLE MENTION KAR LO 🥺 PHIR SIRF NUMBER ME ❮1❯ YA NUMBER ❮2❯ IN DONO ME SE KOI EK NUMBER LIKHO ☺️🌹*");
                }
            }
        });

    } catch (error) {
        console.error("*IMAGE SEARCH ERROR 🥺*", error);
        reply("*APKI IMAGE MUJHE NAHI MILI 🥺❤️*");
    }
});
