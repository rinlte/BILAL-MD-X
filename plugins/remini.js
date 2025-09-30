const { cmd } = require('../command');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

cmd({
    pattern: "remini",
    alias: ["enhance", "hd", "clear"],
    react: "✨",
    desc: "Enhance image quality using Remini API",
    category: "tools",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, args, reply }) => {
    try {
        let q = quoted ? quoted : mek;
        let mime = (q.msg || q).mimetype || "";
        if (!mime || !mime.startsWith("image/")) {
            return reply("📸 Please reply to an *image* with the command.");
        }

        reply("🔄 Enhancing image, please wait...");

        // Download the quoted image
        let mediaPath = path.join(__dirname, "../tmp", Date.now() + ".jpg");
        let buffer = await q.download();
        fs.writeFileSync(mediaPath, buffer);

        // Send to Remini API
        let apiUrl = `https://api.princetechn.com/api/tools/remini?apikey=prince&url=https://files.princetech.web.id/image/myprince.png`;

        // Agar apko apna upload system lagana ho to image upload karke uska URL pass karein ↑

        let { data } = await axios.get(apiUrl);

        if (!data || !data.result) {
            return reply("❌ API did not return a valid image.");
        }

        // Fetch enhanced image
        let enhanced = await axios.get(data.result, { responseType: "arraybuffer" });
        let outPath = path.join(__dirname, "../tmp", Date.now() + "_enhanced.jpg");
        fs.writeFileSync(outPath, enhanced.data);

        await conn.sendMessage(from, { image: fs.readFileSync(outPath), caption: "✨ Enhanced by Remini" }, { quoted: mek });

        fs.unlinkSync(mediaPath);
        fs.unlinkSync(outPath);

    } catch (err) {
        console.error("Remini Error:", err);
        reply("⚠️ Something went wrong while enhancing the image.");
    }
});
