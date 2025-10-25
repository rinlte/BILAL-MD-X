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
        const quoted = m.quoted; // only replied messages
        if (!quoted || !quoted.message || !/image/.test((quoted.msg || quoted).mimetype || '')) {
            return reply(
                "*📸 HDR BANANA HAI?*\n\n" +
                "❗ Pehle koi image bhejo\n" +
                "👉 Us image pe reply karo likh kar `.hdr`\n\n" +
                "_Example:_\n`(reply to image)` → `.hdr`"
            );
        }

        await conn.sendMessage(from, { react: { text: "🔄", key: mek.key } });

        // 📥 Download replied image
        const mediaPath = await conn.downloadAndSaveMediaMessage(quoted);
        const form = new FormData();
        form.append("image", fs.createReadStream(mediaPath));

        // 🌐 API call (no key required)
        const apiUrl = "https://api.id.dexter.it.com/imagecreator/remini";
        const { data } = await axios.post(apiUrl, form, {
            headers: form.getHeaders(),
            responseType: "arraybuffer"
        });

        fs.unlinkSync(mediaPath); // clean temp

        // 🖼 Send enhanced image
        await conn.sendMessage(from, {
            image: Buffer.from(data),
            caption: "*✨ HDR Image Enhanced Successfully!*\n*👑 BY :❯ BILAL-MD 👑*"
        }, { quoted: m });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (error) {
        console.error("❌ HDR Command Error:", error);
        await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
        reply("*❌ Kuch galat ho gaya! Dobaara try karo 🥺*");
    }
});
