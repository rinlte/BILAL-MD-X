const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require('axios');

cmd({
    pattern: "video",
    react: "🥺",
    desc: "Download YouTube video (auto type select)",
    category: "download",
    use: ".video <query>",
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) return reply(
            "*AP NE KOI VIDEO DOWNLOAD KARNI HAI 🥺*\n" +
            "*TO AP ESE LIKHO 😇*\n\n" +
            "*VIDEO ❮APKE VIDEO KA NAM❯*\n\n" +
            "*AP COMMAND ❮VIDEO❯ LIKH KAR USKE AGE APNI VIDEO KA NAME LIKH DO ☺️ FIR WO VIDEO DOWNLOAD KAR KE YAHA BHEJ DE JAYE GE 🥰💞*"
        );

        // 😔 Reaction for process start
        await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });

        // 🔍 YouTube Search
        const search = await yts(q);
        if (!search.videos.length) return reply("*APKI VIDEO MUJHE NAHI MILI 😔💔*");

        const data = search.videos[0];
        const ytUrl = data.url;

        // 📡 API call
        const api = `https://gtech-api-xtp1.onrender.com/api/video/yt?apikey=APIKEY&url=${encodeURIComponent(ytUrl)}`;
        const { data: apiRes } = await axios.get(api);

        if (!apiRes?.status || !apiRes.result?.media?.video_url) {
            return reply("*DUBARA KOSHISH KARO ☹️*");
        }

        // 📦 Extract media info
        const result = apiRes.result.media;
        const videoUrl = result.video_url;
        const thumbUrl = result.thumbnail || data.thumbnail;

        // 😐 React for thumbnail send
        await conn.sendMessage(from, { react: { text: "☹️", key: mek.key } });

        // 🖼️ Send video info with thumbnail
        const captionText = 
`*__________________________________*
*👑 VIDEO KA NAME 👑*
*${data.title}*
*__________________________________*
*👑 CHANNEL :❯* ${data.author?.name || 'Unknown'}
*__________________________________*
*👑 VIEWS :❯* ${data.views || '—'}
*__________________________________*
*👑 TIME :❯* ${data.timestamp || '—'}
*__________________________________*
*👑 UPLOADED :❯* ${data.ago || '—'}
*__________________________________*`;

        await conn.sendMessage(from, {
            image: { url: thumbUrl },
            caption: captionText
        }, { quoted: m });

        // 🌀 Try sending as video first
        try {
            await conn.sendMessage(from, { react: { text: "😃", key: mek.key } });
            await conn.sendMessage(from, {
                video: { url: videoUrl },
                mimetype: "video/mp4",
                caption: `*👑 BY :❯ BILAL-MD 👑*`
            }, { quoted: m });

        } catch (sendError) {
            console.warn("⚠️ Normal video send fail hua, ab file type me bhej rahe hain...");
            await conn.sendMessage(from, { react: { text: "📦", key: mek.key } });

            // 📄 Fallback send as document
            await conn.sendMessage(from, {
                document: { url: videoUrl },
                mimetype: "video/mp4",
                fileName: `${data.title}.mp4`,
                caption: `*👑 BY :❯ BILAL-MD 👑*`
            }, { quoted: m });
        }

        // 😊 Final reaction
        await conn.sendMessage(from, { react: { text: "☺️", key: mek.key } });

    } catch (error) {
        console.error("Video Command Error:", error);
        await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
        reply("*DUBARA KOSHISH KARO 🥺❤️*");
    }
});
