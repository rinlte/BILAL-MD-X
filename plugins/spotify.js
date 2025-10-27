const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "spt",
    alias: ["spotifydl", "spotidown"],
    desc: "Download Spotify music as MP3",
    category: "downloader",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    try {
        if (!q) return reply("*Please provide a Spotify link.*");
        if (!q.includes("spotify.com")) return reply("*Invalid Spotify link provided.*");

        reply("⏳ *Fetching Spotify track... Please wait!*");

        // Direct API call (no key variable needed)
        const apiUrl = `https://gtech-api-xtp1.onrender.com/api/download/spotify?apikey=free&url=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data.status || !data.result) {
            return reply("*⚠️ Failed to fetch Spotify track. Please try again later.*");
        }

        const { title, artist, duration, thumbnail, download_url } = data.result;

        const caption = `
*⫷⦁ SPOTIFY DOWNLOADER ⦁⫸*

🎵 *Title:* ${title}
🧑‍🎤 *Artist:* ${artist}
⏱️ *Duration:* ${duration}

> *DOWNLOADED BY DML-MD*
> *© CREATED BY DML*
`.trim();

        // Send cover image
        await conn.sendMessage(from, {
            image: { url: thumbnail },
            caption
        }, { quoted: mek });

        // Send MP3
        await conn.sendMessage(from, {
            audio: { url: download_url },
            mimetype: "audio/mpeg",
            ptt: false
        }, { quoted: mek });

    } catch (e) {
        console.error("Spotify Download Error:", e);
        reply("*❌ Oops! An error occurred while downloading the Spotify track.*");
    }
});
