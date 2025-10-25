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

        // ✅ Detect image MIME (multi-version compatible)
        const mime = (quoted?.mimetype || quoted?.msg?.mimetype || quoted?.message?.imageMessage?.mimetype || '');
        const isImage = /image/.test(mime);

        if (!quoted || !isImage) {
            return reply(
                "*📸 HDR BANANA HAI?*\n\n" +
                "❗ Pehle koi image bhejo\n" +
                "👉 Us image pe reply karo likh kar `.hdr`\n\n" +
                "_Example:_\n`(reply to image)` → `.hdr`"
            );
        }

        // 🪄 React start
        await conn.sendMessage(from, { react: { text: "🔄", key: mek.key } });

        // 📥 Download image buffer
        const mediaPath = await conn.downloadAndSaveMediaMessage(quoted);

        // 🌐 Free HDR API (no key required)
        const apiUrl = "https://api.itsrose.rest/remini?apikey=freeapi";

        const form = new FormData();
        form.append("image", fs.createReadStream(mediaPath));

        const response = await axios.post(apiUrl, form, {
            headers: form.getHeaders(),
            responseType: "arraybuffer",
        });

        // 🧹 Clean temp file
        fs.unlinkSync(mediaPath);

        // 🖼️ Send enhanced image
        await conn.sendMessage(from, {
            image: Buffer.from(response.data),
            caption: "*✨ HDR Image Enhanced Successfully!*\n*👑 BY :❯ BILAL-MD 👑*"
        }, { quoted: m });

        // ✅ React done
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (error) {
        console.error("❌ HDR Command Error:", error);
        await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
        reply("*❌ Kuch galat ho gaya! Dobaara try karo 🥺*");
    }
});
