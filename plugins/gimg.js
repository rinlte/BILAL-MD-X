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
        if (!q) {
            return reply("*AP NE KOI IMAGE SEARCH KARNI HAI 🥺*\n*Usage:* `.gimg <word>`");
        }

        const api = `https://api.id.dexter.it.com/search/google/image?q=${encodeURIComponent(q)}`;
        console.log("📡 Sending API request:", api);

        let apiRes;
        try {
            const res = await axios.get(api, { timeout: 15000 });
            apiRes = res.data;
            console.log("✅ API response received:", apiRes);
        } catch (err) {
            console.error("❌ Axios request failed:", err.message);
            console.error("📄 Full Axios Error:", err);
            return reply(`⚠️ API request failed: ${err.message}`);
        }

        // FIX: Check 'images' key
        const results = apiRes.results || apiRes.data || apiRes.items || apiRes.images || apiRes;

        if (!Array.isArray(results) || results.length === 0) {
            console.error("❌ No image results found for query:", q);
            return reply(`😔 No images found for: ${q}`);
        }

        const img = results[0]?.url || results[0]?.image || results[0]?.src || results[0];
        const img2 = results[1]?.url || results[1]?.image || results[1]?.src || results[1];

        if (!img) {
            console.error("❌ First image URL missing in API response:", results[0]);
            return reply("⚠️ Image URL missing in API response.");
        }

        const caption = `
*👑 SEARCH KIYA GAYA:* ${q}
*__________________________________*
*PEHLE IS MSG KO MENTION KARO 🥺 PHIR NUMBER ❮1❯ YA ❮2❯ LIKHO GE*`;

        let sentMsg;
        try {
            sentMsg = await conn.sendMessage(from, { image: { url: img }, caption }, { quoted: m });
        } catch (err) {
            console.error("❌ Failed to send first image:", err.message);
            return reply(`⚠️ Failed to send first image: ${err.message}`);
        }

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
                        try {
                            console.log("📤 Sending first image for query:", q);
                            await conn.sendMessage(senderID, { image: { url: img }, caption: `🔍 ${q} (Image 1)` }, { quoted: receivedMsg });
                        } catch (err) {
                            console.error("❌ Failed to send first image:", err.message);
                            await reply(`⚠️ Failed to send first image: ${err.message}`);
                        }
                        break;

                    case "2":
                        if (!img2) {
                            console.error("⚠️ Second image not found for query:", q);
                            return reply("❌ Second image not found!");
                        }
                        try {
                            console.log("📤 Sending second image for query:", q);
                            await conn.sendMessage(senderID, { image: { url: img2 }, caption: `🔍 ${q} (Image 2)` }, { quoted: receivedMsg });
                        } catch (err) {
                            console.error("❌ Failed to send second image:", err.message);
                            await reply(`⚠️ Failed to send second image: ${err.message}`);
                        }
                        break;

                    default:
                        reply("⚠️ Reply with ❮1❯ or ❮2❯ only.");
                }
            }
        });

    } catch (err) {
        console.error("❌ IMAGE COMMAND ERROR:", err.message);
        console.error("📄 Full Error Object:", err);
        reply(`❌ Something went wrong: ${err.message}`);
    }
});
