const { cmd } = require("../command");
const axios = require('axios');
const fs = require('fs');
const path = require("path");
const AdmZip = require("adm-zip");
const { setCommitHash, getCommitHash } = require('../data/updateDB');

cmd({
    pattern: "update",
    alias: ["upgrade", "sync"],
    react: '👑',
    desc: "Update the bot to the latest version.",
    category: "misc",
    filename: __filename
}, async (client, message, args, { reply, isOwner }) => {
    if (!isOwner) return reply("*_AP YE COMMAND USE NAHI KAR SAKTE_* \n *_YEH COMMAND SIRF MERE LIE HAI_*");

    try {
        await reply("*_ADDING NEW VERSION...._*");

        // Fetch the latest commit hash from GitHub (BiLAL-md repo)
        const { data: commitData } = await axios.get("https://api.github.com/repos/BilalTech05/BiLAL-MD/commits/main");
        const latestCommitHash = commitData.sha;

        // Get the stored commit hash from the database
        const currentHash = await getCommitHash();

        if (latestCommitHash === currentHash) {
            return reply("*YEH BILAL-MD BOT KA NEW VERSION HAI JO AP USE KAR RAHE HAI☺️❤️*");
        }

        await reply("*_UPDATING BILAL-MD BOT..._*");

        // Download the latest code (BiLAL-md repo)
        const zipPath = path.join(__dirname, "latest.zip");
        const { data: zipData } = await axios.get("https://github.com/BilalTech05/BiLAL-MD/archive/refs/heads/main.zip", { responseType: "arraybuffer" });
        fs.writeFileSync(zipPath, zipData);

        // Extract ZIP file
        await reply("*_ADDING NEW FEATURES..._*");
        const extractPath = path.join(__dirname, 'latest');
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(extractPath, true);

        // Copy updated files, preserving config.js and app.json
        await reply("*_STARTING...._*");
        const sourcePath = path.join(extractPath, "BiLAL-md-main");
        const destinationPath = path.join(__dirname, '..');
        copyFolderSync(sourcePath, destinationPath);

        // Save the latest commit hash to the database
        await setCommitHash(latestCommitHash);

        // Cleanup
        fs.unlinkSync(zipPath);
        fs.rmSync(extractPath, { recursive: true, force: true });

        await reply("*👑 BILAL-MD BOT AB UPDATE HO CHUKA HAI 👑* \n *🥰 APKE BOT ME NEW FEATURES ADD HO CHUKE HAI 🥰*");
        process.exit(0);
    } catch (error) {
        console.error("Update error:", error);
        return reply("*BOT ME KOI PROBLEM HAI BOT UPDATE NAHI HO RAHA 🥺♥️*");
    }
});

// Helper function to copy directories while preserving config.js and app.json
function copyFolderSync(source, target) {
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true });
    }

    const items = fs.readdirSync(source);
    for (const item of items) {
        const srcPath = path.join(source, item);
        const destPath = path.join(target, item);

        // Skip config.js and app.json
        if (item === "config.js" || item === "app.json") {
            console.log(`Skipping ${item} to preserve custom settings.`);
            continue;
        }

        if (fs.lstatSync(srcPath).isDirectory()) {
            copyFolderSync(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}
