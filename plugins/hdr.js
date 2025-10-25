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
        const quoted = m.quoted;

        // 🖼️ Check if user replied to an image
        if (!quoted || !quoted.message || !/image/.test((quoted.msg || quoted).mimetype || '')) {
            return reply(
                "*📸 HDR BANANA HAI?*\n\n" +
                "❗ Pehle koi image bhejo\n" +
                "👉 Us image pe reply karo likh kar `.hdr`\n\n" +
                "_Example:_\n`(reply to image)` → `.hdr`"
            );
        }

        // 🔄 React: processing start
        await conn.sendMessage(from, { react: { text: "🔄", key: mek.key } });

        // 📥 Download the replied image
        const mediaPath = await conn.downloadAndSaveMediaMessage(quoted);

        // 🌐 Use free HDR API (no key required)
        const apiUrl = "https://api.itsrose.rest/remini?apikey=freeapi";

        const form = new FormData();
        form.append("image", fs.createReadStream(mediaPath));

        const response = await axios.post(apiUrl, form, {
            headers: form.getHeaders(),
            responseType: "arraybuffer"
        });

        // 🧹 Cleanup original image
        fs.unlinkSync(mediaPath);

        // 🖼️ Send enhanced HDR image
        await conn.sendMessage(from, {
            image: Buffer.from(response.data),
            caption: "*✨ HDR Image Enhanced Successfully!*\n*👑 BY :❯ BILAL-MD 👑*"
        }, { quoted: m });

        // ✅ Final react
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (error) {
        console.error("❌ HDR Command Error:", error);
        await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
        reply("*❌ Kuch galat ho gaya! Dobaara try karo 🥺*");
    }
});
