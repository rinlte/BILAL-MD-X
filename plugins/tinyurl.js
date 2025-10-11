const axios = require('axios');
const { cmd } = require('../command');

// 👑 TinyURL Shortener Command (Prince API)
cmd({
    pattern: "tinyurl",
    alias: ["short", "shorturl"],
    desc: "Shorten any long URL using Prince API",
    category: "tools",
    react: "🔗",
    filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        // 📌 Agar user ne koi URL nahi diya
        if (!args[0]) {
            return reply("⚠️ Please provide a valid URL!\n\nExample:\n.tinyurl https://example.com");
        }

        const longUrl = args[0];
        const apiKey = "prince";

        // 🔗 API Call
        const apiUrl = `https://api.princetechn.com/api/tools/tinyurl?apikey=${apiKey}&url=${encodeURIComponent(longUrl)}`;
        const res = await axios.get(apiUrl);

        // 🧾 Response Handle
        if (res.data && res.data.result) {
            const shortUrl = res.data.result;
            const msg = `
🔗 *Prince TinyURL Shortener*

🌍 Original: ${longUrl}
✨ Shortened: ${shortUrl}

⚙️ Powered by: *Prince API*
👑 BILAL-MD BOT
            `;
            await conn.sendMessage(from, { text: msg }, { quoted: m });
        } else {
            reply("❌ Failed to shorten URL. Please check your API or try again later.");
        }

    } catch (error) {
        console.error("TinyURL Command Error:", error.message);
        reply("🚫 Something went wrong! Please try again later.");
    }
});
