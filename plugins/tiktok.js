const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "tiktok",
    alias: ["ttdl", "tt", "tiktokdl"],
    desc: "Download TikTok video without watermark",
    category: "downloader",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    let waitMsg; // Reference for waiting message
    try {
        // React command msg 🥺
        await conn.sendMessage(from, { react: { text: "🥺", key: mek.key } });

        if (!q) {
            return reply(
                "*AGAR AP NE TIKTOK KI VIDEO DOWNLOAD KARNI HAI 🥺💓* \n" +
                "*TO AP ESE LIKHO 😇♥️* \n\n" +
                "*TIKTOK ❮APKI TIKTOK VIDEO KA LINK❯* \n\n" +
                "*AP APNI TIKTOK VIDEO KA LINK COMMAND ❮TIKTOK❯ LIKH KER ☺️*\n" +
                "*USKE AGE APNI TIKTOK VIDEO KA LINK PASTE KAR DO 😊*\n" +
                "*TO APKI TIKTOK VIDEO DOWNLOAD KARNE KE BAAD 😍*\n" +
                "*YAHA BHEJ DE JAYE GE 🥰*"
            );
        }

        if (!q.includes("tiktok.com")) {
            await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
            return reply("*DUBARA KOSHISH KARE 🥺 (LINK GALAT HAI)*");
        }

        // Send waiting msg
        waitMsg = await conn.sendMessage(from, {
            text: "*APKI TIKTOK VIDEO DOWNLOAD HO RAHI HAI ☺️*\n*JAB DOWNLOAD COMPLETE HO JAYE GE TO YAHA BHEJ DE JAYE GE 🥰*"
        });

        const apiUrl = `https://lance-frank-asta.onrender.com/api/downloader?url=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data?.status || !data?.data) {
            if (waitMsg?.key) await conn.sendMessage(from, { delete: waitMsg.key });
            await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
            return reply("*VIDEO DOWNLOAD FAILED 😭 DUBARA KOSHISH KARE 🥺*");
        }

        // Safe extraction
        const videoData = data?.data?.meta?.media?.find(v => v.type === "video");
        if (!videoData?.org) {
            if (waitMsg?.key) await conn.sendMessage(from, { delete: waitMsg.key });
            await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
            return reply("*VIDEO LINK VALID NAHI MILA 🥺*");
        }

        const videoUrl = videoData.org;

        // Caption
        const caption = "👑 *BY:* BILAL-MD 👑";

        // Send video
        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: caption,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: mek });

        // Delete waiting msg
        if (waitMsg?.key) await conn.sendMessage(from, { delete: waitMsg.key });

        // Success react
        await conn.sendMessage(from, { react: { text: "☺️", key: mek.key } });

    } catch (e) {
        console.error("TikTok command error:", e);
        if (waitMsg?.key) await conn.sendMessage(from, { delete: waitMsg.key });
        await conn.sendMessage(from, { react: { text: "😔", key: mek.key } });
        reply("*ERROR AYA 😭 DUBARA KOSHISH KARE 🥺*");
    }
});
