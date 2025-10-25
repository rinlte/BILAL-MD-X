const { cmd } = require('../command');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

cmd({
    pattern: "hdr",
    react: "🪄",
    desc: "Enhance replied image using AI HDR (Remini)",
    category: "image",
    use: ".hdr (reply to an image)",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const quoted = m.quoted || m.quotedMessage || m.quotedMsg;
        const mime = (quoted?.mimetype || quoted?.msg?.mimetype || quoted?.message?.imageMessage?.mimetype || '');

        if (!quoted || !/image/.test(mime)) {
            return reply(
                "*📸 HDR BANANA HAI?*\n\n" +
                "❗ Pehle koi image bhejo\n" +
                "👉 Us image pe reply karo likh kar `.hdr`\n\n" +
                "_Example:_\n`(reply to image)` → `.hdr`"
            );
        }

        await conn.sendMessage(from, { react: { text: "🔄", key: mek.key } });

        // ✅ Download image as buffer (more reliable)
        const buffer = await quoted.download();
        if (!buffer) return reply("❌ Image download failed. Try again!");

        // 🌐 Working free HDR API (no key required)
        const apiUrl = "https://api.neoxr.eu/api/remini?apikey=freeapi";

        const form = new FormData();
        form.append("image", buffer, { filename: "input.jpg" });

        const response = await axios.post(apiUrl, form, {
            headers: form.getHeaders(),
            responseType: "arraybuffer",
        });

        await conn.sendMessage(from, {
            image: Buffer.from(response.data),
            caption: "*✨ HDR Image Enhanced Successfully!*\n*👑 BY :❯ BILAL-MD 👑*"
        }, { quoted: m });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (error) {
        console.error("❌ HDR Command Error:", error?.response?.data || error.message);
        await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
        reply("*❌ Kuch galat ho gaya! Dobaara try karo 🥺*");
    }
});
