const axios = require('axios');
const { sleep } = require('../lib/myfunc');
const { cmd } = require('../command');

cmd({
    pattern: "pair",
    desc: "Get WhatsApp pairing code",
    category: "tools",
    react: "🔑",
    filename: __filename
},
async (conn, m, store, { from, q, reply }) => {
    try {
        if (!q) {
            return reply("📌 Please provide valid WhatsApp number\n\nExample: .pair 91702395XXXX");
        }

        const numbers = q.split(',')
            .map((v) => v.replace(/[^0-9]/g, ''))
            .filter((v) => v.length > 5 && v.length < 20);

        if (numbers.length === 0) {
            return reply("❌ Invalid number. Please use the correct format!");
        }

        for (const number of numbers) {
            const whatsappID = number + '@s.whatsapp.net';

            // check if number exists on WhatsApp
            let existsResult = [];
            try {
                existsResult = await conn.onWhatsApp(whatsappID);
            } catch (e) {
                console.error("onWhatsApp error:", e);
            }

            if (!existsResult[0]?.exists) {
                await reply(`❌ Number *${number}* is not registered on WhatsApp!`);
                continue; // next number
            }

            // Inform user that generation started (optional short reply)
            await reply("⏳ Wait a moment, generating your pairing code...");

            try {
                const response = await axios.get(`https://pair-vd1s.onrender.com/code?number=${number}`, { timeout: 20000 });

                if (response.data && response.data.code) {
                    const code = String(response.data.code).trim();

                    if (!code || code === "Service Unavailable") {
                        throw new Error('Service Unavailable');
                    }

                    // 1) Send single message that contains ONLY the code (code block)
                    await conn.sendMessage(from, {
                        text: `\`\`\`${code}\`\`\``
                    }, { quoted: m });

                    // small delay to ensure order
                    await sleep(800);

                    // 2) Send the notice/instructions message
                    const notice = `*BILAL-MD BOT KA PAIR CODE APKE NUMBER E SATH CONNECT HO CHUKA HAI 🥰🌹*\n*AP IS PAIR CODE KO APNE WHATSAPP ME 30 SECONDS K ANDAR LINK KAR LO 🥺❤️*\n*WARNA CODE EXPIRE HO JAYE GA 🥺❤️*\n*AGAR EXPIRE B HO JAYE TO AP DUBARA ❮PAIR❯ COMMAND KA ISTEMAL KAR KE DUBARA PAIR CODE NEW BANA SAKTE HAI 🥰💓♥️*\n*👑 BILAL-MD WHATSAPP BOT 👑*`;

                    await conn.sendMessage(from, {
                        text: notice
                    }, { quoted: m });

                } else {
                    throw new Error('Invalid response from server');
                }
            } catch (apiError) {
                console.error('API Error:', apiError);
                const errorMessage = apiError.message === 'Service Unavailable'
                    ? "⚠️ Service is currently unavailable. Please try again later."
                    : "❌ Failed to generate pairing code. Please try again later.";
                await reply(errorMessage);
            }
        }
    } catch (err) {
        console.error("Pair command error:", err);
        reply("❌ An unexpected error occurred. Please try again later.");
    }
});
