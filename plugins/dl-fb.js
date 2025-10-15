const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { cmd } = require("../command");

// 🔹 Facebook Video Downloader Function (New API)
async function downloadFacebookVideo(url) {
    const apiUrl = `https://api.dmltools.tech/fb3?url=${encodeURIComponent(url)}`;
    const res = await axios.get(apiUrl, { timeout: 40000 });

    if (!res.data || !res.data.result || (!res.data.result.hd && !res.data.result.sd)) {
        throw new Error("Invalid API response");
    }

    return res.data.result.hd || res.data.result.sd;
}

async function saveVideo(url) {
    const tmpDir = path.join(process.cwd(), "tmp");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    const filePath = path.join(tmpDir, `fb_${Date.now()}.mp4`);
    const response = await axios({ url, method: "GET", responseType: "stream" });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
        writer.on("finish", resolve);
        writer.on("error", reject);
    });

    return filePath;
}

// -------------------------
// Command: .fb <url>
// -------------------------
cmd({
    pattern: "fb",
    alias: ["facebook", "fb1", "fb2", "fbdl", "fbvideo", "facebookvideo", "lite", "fvid", "fvide", "fvideo", "fbdlvideo"],
    desc: "Download Facebook videos",
    category: "downloader"
}, async (conn, mek, m, { args }) => {
    try {
        // 👇 Command message per 🥺 react add
        await conn.sendMessage(m.chat, { react: { text: "🥺", key: mek.key } });

        const url = args[0];
        if (!url) return conn.sendMessage(m.chat, { text: "*APKO FACEBOOK KI VIDEO DOWNLOAD KARNA HAI 🥺*\nTOH AP AISE LIKHO ☺️* \n \n *FB ❮APKI FACEBOOK VIDEO KA LINK❯* \n \n *TO APKI FACEBOOK VIDEO DOWNLOAD KAR KE YAHA PER BHEJ DE JAYE GE 🥰💞`" }, { quoted: mek });

        if (!url.includes("facebook.com")) {
            const invalidMsg = await conn.sendMessage(m.chat, { text: "*YEH FACEBOOK VIDEO KA LINK NAHI 🥺*" }, { quoted: mek });
            // 👇 react 😥 on invalid link message
            await conn.sendMessage(m.chat, { react: { text: "😥", key: invalidMsg.key } });
            return;
        }

        // Waiting message
        const waitMsg = await conn.sendMessage(m.chat, { text: "*APKI FACEBOOK VIDEO DOWNLOAD HO RAHI HAI....☺️🌹*" }, { quoted: mek });
        await conn.sendMessage(m.chat, { react: { text: "🥺", key: waitMsg.key } });

        const fbvid = await downloadFacebookVideo(url);
        const filePath = await saveVideo(fbvid);

        // Send video
        await conn.sendMessage(m.chat, {
            video: { url: filePath },
            mimetype: "video/mp4",
            caption: "*_________________________________*\n*👑 FACEBOOK VIDEO NAME 👑* \n*${url}*\n*_________________________________*\n*MENE APKI FACEBOOK VIDEO DOWNLOAD KAR DI HAI OK ☺️ OR KOI FACEBOOK VIDEO CHAHYE TO MUJHE LINK DENA 😍 KAR DE GE FACEBOOK VIDEO DOWNLOAD KOI MASLA NAHI BEE HAPPY DEAR 🥰💞* \n*_________________________________*\n *👑 BY :❯ BILAL-MD 👑*\n*_________________________________*"
        }, { quoted: mek });

        // React on command/link message
        await conn.sendMessage(m.chat, { react: { text: "☺️", key: mek.key } });

        // Delete waiting message
        await conn.sendMessage(m.chat, { delete: waitMsg.key });

        fs.unlinkSync(filePath);
    } catch (e) {
        console.error("ERROR :❯", e);
        conn.sendMessage(m.chat, { text: "APKI VIDEO NAHI MILI SORRY 🥺❤️." }, { quoted: mek });
    }
});
