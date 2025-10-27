const { cmd } = require("../command");
const axios = require("axios");

cmd({
    pattern: "sptsearch",
    alias: ["spotifysearch", "spotisearch", "spsearch"],
    desc: "Search new Spotify songs or albums",
    category: "downloader",
    react: "🎧",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        const query = args.join(" ");
        if (!query) {
            return reply(
                "*🎶 Example:* .sptsearch Arijit Singh\n\n👉 Yeh command Spotify se nayi songs list dikhayegi 💿"
            );
        }

        // 🌀 React during processing
        await conn.sendMessage(from, { react: { text: "⏳", key: mek.key } });


        // ⚙️ Replace with your actual source API internally
        const realApi = `https://apis-starlights-team.koyeb.app/starlight/spotify-search?query=${encodeURIComponent(query)}`;

        // 🔹 Call real API
        const response = await axios.get(realApi);

        if (!response.data?.result || response.data.result.length === 0) {
            await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
            return reply("*😔 No songs found for your search.*");
        }

        const results = response.data.result.slice(0, 15); // limit to 15 songs
        let msg = `🎧 *SPOTIFY SEARCH RESULT*\n\n🔍 *Query:* ${query}\n\n`;

        results.forEach((song, i) => {
            msg += `*${i + 1}. ${song.title}*\n👨‍🎤 ${song.artist}\n🔗 ${song.url}\n\n`;
        });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        reply(msg.trim());

    } catch (err) {
        console.error("Spotify Search Error:", err);
        await conn.sendMessage(from, { react: { text: "⚠️", key: mek.key } });
        reply("*⚠️ Error fetching Spotify search results.*");
    }
});
