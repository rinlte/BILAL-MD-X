// place this file in your commands folder
const { cmd } = require('../command');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
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
        // 1) Ensure the message is a reply
        const quoted = m.quoted;
        if (!quoted || !quoted.message) {
            return reply(
                "*📸 HDR BANANA HAI?*\n\n" +
                "❗ Pehle koi image bhejo\n" +
                "👉 Us image pe reply karo aur likho `.hdr`\n\n" +
                "_Example:_\n`(reply to image)` → `.hdr`"
            );
        }

        // 2) Detect image MIME safely (Baileys compatibility)
        // quoted.message could contain imageMessage, extendedTextMessage, documentMessage, etc.
        const msg = quoted.message;
        let isImage = false;
        let fileName = `hdr_input_${Date.now()}`;

        // Common payloads
        if (msg.imageMessage) {
            isImage = true;
            // attempt to extract filename if present
            fileName = msg.imageMessage.fileName || fileName + ".jpg";
        } else if (msg.documentMessage && msg.documentMessage.mimetype && msg.documentMessage.mimetype.startsWith('image/')) {
            isImage = true;
            fileName = msg.documentMessage.fileName || fileName;
        } else if (msg.extendedTextMessage && msg.extendedTextMessage.contextInfo && msg.extendedTextMessage.contextInfo.quotedMessage) {
            // nested quoted (rare) - try deeper
            const nested = msg.extendedTextMessage.contextInfo.quotedMessage;
            if (nested.imageMessage) {
                isImage = true;
                fileName = nested.imageMessage.fileName || fileName + ".jpg";
            }
        }

        if (!isImage) {
            return reply(
                "*❗ Ye message image nhi hai.*\n\n" +
                "Kisi image pe reply karo phir `.hdr` likho."
            );
        }

        // 3) React: processing
        await conn.sendMessage(from, { react: { text: "🔄", key: mek.key } });

        // 4) Download the replied image to a temp path
        // use provided helper if available
        let mediaPath;
        try {
            // Some bot bases use conn.downloadAndSaveMediaMessage
            if (typeof conn.downloadAndSaveMediaMessage === 'function') {
                mediaPath = await conn.downloadAndSaveMediaMessage(quoted);
            } else if (typeof conn.downloadMediaMessage === 'function') {
                // newer/other variants: provide a writable path
                const buffer = await conn.downloadMediaMessage(quoted);
                const tmpPath = path.join(__dirname, `tmp_${Date.now()}_${fileName}`);
                fs.writeFileSync(tmpPath, buffer);
                mediaPath = tmpPath;
            } else {
                throw new Error('No download helper available on conn (downloadAndSaveMediaMessage / downloadMediaMessage).');
            }
        } catch (dlErr) {
            console.error("❌ Download error:", dlErr);
            await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
            return reply("*❌ Image download failed. Ensure the bot can download media.*");
        }

        // 5) Prepare form-data and call HDR API
        const form = new FormData();
        form.append('image', fs.createReadStream(mediaPath));

        const apiUrl = "https://api.id.dexter.it.com/imagecreator/remini";

        let apiResponse;
        try {
            apiResponse = await axios.post(apiUrl, form, {
                headers: {
                    ...form.getHeaders()
                },
                responseType: 'arraybuffer',
                timeout: 120000 // 2 minutes timeout in case processing is slow
            });
        } catch (apiErr) {
            console.error("❌ HDR API error:", apiErr?.response?.status, apiErr?.response?.data?.toString?.() || apiErr.message);
            // cleanup
            try { fs.unlinkSync(mediaPath); } catch(e){/* ignore */ }
            await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
            return reply("*❌ HDR API reachable, but processing failed. Try again later.*");
        }

        // 6) Save or send buffer directly
        const enhancedBuffer = Buffer.from(apiResponse.data);

        // optional: save enhanced copy (for debug) - commented out
        // const savedOut = path.join(__dirname, `hdr_out_${Date.now()}.jpg`);
        // fs.writeFileSync(savedOut, enhancedBuffer);

        // 7) cleanup input temp
        try { fs.unlinkSync(mediaPath); } catch (e) { /* ignore cleanup errors */ }

        // 8) Send enhanced image
        await conn.sendMessage(from, {
            image: enhancedBuffer,
            caption: "*✨ HDR Image Enhanced Successfully!*\n*👑 BY :❯ BILAL-MD 👑*"
        }, { quoted: m });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (error) {
        console.error("❌ HDR Command top-level error:", error);
        try { await conn.sendMessage(from, { react: { text: "😔", key: mek.key } }); } catch(e){/*ignore*/ }
        reply("*❌ Kuch galat ho gaya! Dobaara try karo 🥺*");
    }
});
