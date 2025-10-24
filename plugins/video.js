const { cmd } = require('../command');
const yts = require('yt-search');
const axios = require('axios');

cmd({
    pattern: "video",
    react: "🎬",
    desc: "Download YouTube video (auto detect type)",
    category: "download",
    use: ".video <query>",
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) {
            return reply(
                "*AP NE KOI VIDEO DOWNLOAD KARNI HAI 🥺*\n" +
                "*TO AP ESE LIKHO 😇*\n\n" +
                "*VIDEO ❮APKE VIDEO KA NAM❯*\n\n" +
                "*AP COMMAND ❮VIDEO❯ LIKH KAR USKE AGE APNI VIDEO KA NAME LIKH DO ☺️ FIR WO VIDEO DOWNLOAD KAR KE YAHA BHEJ DE JAYE GE 🥰💞*"
            );
        }

        await conn.sendMessage(from, { react: { text: "🔍", key: mek.key } });

        const search = await yts(q);
        if (!search || !search.videos || !search.videos.length) return reply("*APKI VIDEO MUJHE NAHI MILI 😔💔*");

        const data = search.videos[0];
        const ytUrl = data.url;

        const api = `https://gtech-api-xtp1.onrender.com/api/video/yt?apikey=YOUR_REAL_API_KEY&url=${encodeURIComponent(ytUrl)}`;
        const { data: apiRes } = await axios.get(api);

        if (!apiRes?.status || !(apiRes.result?.video_url || apiRes.result?.media?.video_url)) {
            return reply("*DUBARA KOSHISH KARO ☹️ API ERROR!*");
        }

        const result = apiRes.result.media || apiRes.result;
        const videoUrl = result.video_url;
        const thumbUrl = result.thumbnail || data.thumbnail;

        const captionText =
`*╭━━━〔 👑 BILAL-MD 👑 〕━━━┈⊷*
*┃🎥 Title:* ${data.title}
*┃📺 Channel:* ${data.author?.name || "Unknown"}
*┃⏱ Duration:* ${data.timestamp}
*┃📅 Uploaded:* ${data.ago}
*┃👁 Views:* ${data.views}
*╰━━━━━━━━━━━━━━━┈⊷*`;

        await conn.sendMessage(from, {
            image: { url: thumbUrl },
            caption: captionText
        }, { quoted: m });

        await conn.sendMessage(from, { react: { text: "⬇️", key: mek.key } });

        try {
            await conn.sendMessage(from, {
                video: { url: videoUrl },
                mimetype: "video/mp4",
                caption: "*👑 BY :❯ BILAL-MD 👑*"
            }, { quoted: m });
        } catch {
            await conn.sendMessage(from, { react: { text: "📦", key: mek.key } });
            await conn.sendMessage(from, {
                document: { url: videoUrl },
                mimetype: "video/mp4",
                fileName: `${data.title}.mp4`,
                caption: "*👑 BY :❯ BILAL-MD 👑*"
            }, { quoted: m });
        }

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (error) {
        console.error("❌ Video Command Error:", error);
        await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
        reply("*DUBARA KOSHISH KARO 🥺❤️*");
    }
});
