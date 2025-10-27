const { cmd } = require("../command");
const axios = require("axios");

cmd({
    pattern: "ttsearch",
    alias: ["tiktoksearch", "tsearch", "ttfind"],
    desc: "Search TikTok videos by keyword",
    category: "downloader",
    react: "🎥",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        const query = args.join(" ");
        if (!query) {
            return reply(
                "*🎬 Example:* .ttsearch funny videos\n\n👉 Yeh command TikTok se search result list dikhayegi 📱"
            );
        }

        // ⏳ React while loading
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });

        // 🧠 Replace this with your API key
        const apiKey = "YOUR_API_KEY_HERE"; // <-- apni key yahan likho
        const api = `https://foreign-marna-sithaunarathnapromax-9a005c2e.koyeb.app/api/tiktok/search?apiKey=${apiKey}&q=${encodeURIComponent(query)}`;

        // 🔹 Fetch data from API
        const response = await axios.get(api);

        if (!response.data?.result || response.data.result.length === 0) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("*😔 No TikTok videos found for your search.*");
        }

        const results = response.data.result.slice(0, 15); // limit 15 results

        // 🧾 Format output
        let msg = `🎥 *TIKTOK SEARCH RESULTS*\n\n🔍 *Query:* ${query}\n\n`;
        results.forEach((vid, i) => {
            msg += `*${i + 1}. ${vid.title || "No Title"}*\n👤 ${vid.author || "Unknown"}\n🔗 ${vid.url}\n\n`;
        });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        reply(msg.trim());

    } catch (err) {
        console.error("TikTok Search Error:", err);
        await conn.sendMessage(from, { react: { text: "⚠️", key: mek.key } });
        reply("*⚠️ Error fetching TikTok search results.*");
    }
});
