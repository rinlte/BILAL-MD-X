const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { cmd } = require("../command");

async function downloadFacebookVideo(url) {
    // API Call
    const apiUrl = `https://api.princetechn.com/api/download/facebook?apikey=prince&url=${encodeURIComponent(url)}`;
    const res = await axios.get(apiUrl, { timeout: 40000 });

    if (!res.data || res.data.status !== 200 || !res.data.success || !res.data.result) {
        throw new Error("Invalid API response");
    }

    return res.data.result.hd_video || res.data.result.sd_video;
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
    alias: ["facebook", "fb1", "fb2", "fbdl", "fbvideo", "facebookvideo", "lite", "fbvideo", "fvid", "fvide", "fvideo", "fbdlvideo"],
    desc: "Download Facebook videos",
    category: "downloader"
}, async (conn, mek, m, { args }) => {
    try {
        const url = args[0];
        if (!url) return conn.sendMessage(m.chat, { text: "*APKO FACEBOOK KI VIDEO DOWNLOAD KARNI HAI 😊* \n *TO ESE LIKHO ....🌹 \n *FB https://www.facebook.com/share/r/1M8iCXHNor/* \n * BAS COMMAND ❮FB❯ LIKH KER USKE AGE APNI FACEBOOK VIDEO KA LINK PASTE KR DO APKI VIDEO DOWNLOAD HO KAR IDHAR BHEJ DI JAYE GE 🥰🌺❤️" }, { quoted: mek });
        if (!url.includes("facebook.com")) return conn.sendMessage(m.chat, { text: "⚠️ Invalid Facebook URL." }, { quoted: mek });

        await conn.sendMessage(m.chat, { react: { text: "⏳", key: mek.key } });

        const fbvid = await downloadFacebookVideo(url);
        const filePath = await saveVideo(fbvid);

        await conn.sendMessage(m.chat, {
            video: { url: filePath },
            mimetype: "video/mp4",
            caption: "YEH LO APKI VIDEO DOWNLOAD KAR DI MENE 😊❤️"
        }, { quoted: mek });

        fs.unlinkSync(filePath);
    } catch (e) {
        console.error("ERROR :❯", e);
        conn.sendMessage(m.chat, { text: "APKI VIDEO NAHI MILI SORRY 🥺❤️." }, { quoted: mek });
    }
});

// -------------------------
// Auto Downloader (If only FB link is sent)
// -------------------------
cmd({
    on: "text"
}, async (conn, mek, m, { body }) => {
    try {
        if (!body.includes("facebook.com")) return;
        const url = body.match(/https?:\/\/[^\s]+/i)[0];
        if (!url) return;

        await conn.sendMessage(m.chat, { react: { text: "⏳", key: mek.key } });

        const fbvid = await downloadFacebookVideo(url);
        const filePath = await saveVideo(fbvid);

        await conn.sendMessage(m.chat, {
            video: { url: filePath },
            mimetype: "video/mp4",
            caption: "YEH LO APKI VIDEO MENE DOWNLOAD KAR DI HAI 😊❤️"
        }, { quoted: mek });

        fs.unlinkSync(filePath);
    } catch (e) {
        console.error("FB AutoDL Error:", e);
    }
});
