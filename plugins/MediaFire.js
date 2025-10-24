const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "mediafire",
    react: "📦",
    desc: "Download MediaFire file (any type)",
    category: "download",
    use: ".mediafire <url>",
    filename: __filename
}, async (conn, mek, m, { from, reply, q }) => {
    try {
        if (!q) {
            return reply(
                "*AP NE KOI MEDIAFIRE FILE DOWNLOAD KARNI HAI 🥺*\n" +
                "*TO AP ESE LIKHO 😇*\n\n" +
                "*MEDIAFIRE ❮LINK❯*\n\n" +
                "*AP COMMAND ❮MEDIAFIRE❯ LIKH KAR USKE AGE APNI MEDIAFIRE FILE KA LINK LIKH DO ☺️ FIR WO FILE YAHA BHEJ DI JAYE GI 🥰💞*"
            );
        }

        await conn.sendMessage(from, { react: { text: "🔍", key: mek.key } });

        // 🧠 API Request
        const api = `https://gtech-api-xtp1.onrender.com/api/download/mediafire?url=${encodeURIComponent(q)}&apikey=YOUR_REAL_API_KEY`;
        const { data } = await axios.get(api);

        if (!data.status || !data.result?.link) {
            return reply("*MEDIAFIRE FILE NAHI MILI 😔 YA API DOWN HAI 💔*");
        }

        const result = data.result;
        const fileName = result.filename || "unknown_file";
        const fileSize = result.filesize || "Unknown Size";
        const fileType = result.filetype || "Unknown Type";
        const downloadUrl = result.link;

        // 📋 Caption
        const caption = 
`*╭━━━〔 📁 MEDIAFIRE FILE INFO 〕━━━┈⊷*
*┃📦 File:* ${fileName}
*┃📏 Size:* ${fileSize}
*┃🧾 Type:* ${fileType}
*┃🌐 Source:* MediaFire
*╰━━━━━━━━━━━━━━━┈⊷*
*👑 BY :❯ BILAL-MD 👑*`;

        // 📨 Send info first
        await conn.sendMessage(from, { text: caption }, { quoted: m });

        await conn.sendMessage(from, { react: { text: "⬇️", key: mek.key } });

        // 🗂️ Try sending as document
        await conn.sendMessage(from, {
            document: { url: downloadUrl },
            mimetype: "application/octet-stream",
            fileName: fileName,
            caption: "*👑 FILE BY :❯ BILAL-MD 👑*"
        }, { quoted: m });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (error) {
        console.error("❌ MediaFire Command Error:", error);
        await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
        reply("*DUBARA KOSHISH KARO 🥺 API YA LINK ERROR 💔*");
    }
});
