const axios = require("axios");
const config = require("../config");
const { cmd } = require("../command");

cmd({
    pattern: "repo",
    alias: ["sc", "script", "infobot", "r", "re", "rep", "repos", "botlink", "?"],
    desc: "Fetch GitHub repository information",
    react: "📂",
    category: "info",
    filename: __filename,
},
async (conn, mek, m, { from, reply }) => {
    const githubRepoURL = "https://github.com/BilalTech05/BILAL-MD";
    const channelLink = "https://whatsapp.com/channel/0029Vaj3Xnu17EmtDxTNnQ0G";

    try {
        const cleanUrl = githubRepoURL.replace(/\/+$/, "");
        const match = cleanUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) return reply("⚠️ Invalid GitHub repo URL set in code!");

        const [, username, repoName] = match;
        const response = await axios.get(`https://api.github.com/repos/${username}/${repoName}`);
        const repoData = response.data;

        // Caption style
        const style = `*BILAL-MD WHATSAPP BOT 😇 PAKISTAN KA PEHLA BOT HAI ☺️ JO URDU ZUBAN ME DESIGN KIA GAYA HAI 🥰🌹*
*👑 USER:❯ ${repoData.owner.login}*
*👑 STARS:❯ ${repoData.stargazers_count}*
*👑 FORKS:❯ ${repoData.forks_count}*
🔗 *LINK:❯ https://bilal-md-web-1x-z9o7.vercel.app/*
📝 Description:❯ ${repoData.description || 'No description'}`;

        // ✅ Send image with BUTTONS
        await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL || "https://files.catbox.moe/kunzpz.png" },
            caption: style,
            footer: "👑 BILAL-MD BOT 👑",
            buttons: [
                { buttonId: "stars_info", buttonText: { displayText: `⭐ Stars (${repoData.stargazers_count})` }, type: 1 },
                { buttonId: "forks_info", buttonText: { displayText: `🍴 Forks (${repoData.forks_count})` }, type: 1 },
                { buttonId: "channel_btn", buttonText: { displayText: "📢 Join Channel" }, type: 1 }
            ],
            headerType: 4
        }, { quoted: mek });

        // ✅ Optional: Send audio jingle
        await conn.sendMessage(from, {
            audio: { url: "https://files.catbox.moe/kfsn0s.mp3" },
            mimetype: "audio/mp4",
            ptt: true
        }, { quoted: mek });

    } catch (error) {
        console.error("Repo command error:", error);
        reply(`❌ Error: ${error.message}`);
    }
});
