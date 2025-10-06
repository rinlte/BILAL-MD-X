const { cmd } = require("../command");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");
const { setCommitHash, getCommitHash } = require("../data/updateDB");
const config = require("../config");

// ────────────────────────────────
// Heroku vars for restart
// ────────────────────────────────
const HEROKU_APP = config.HEROKU_APP_NAME || "";
const HEROKU_API = config.HEROKU_API_KEY || "";

cmd({
  pattern: "update",
  alias: ["upgrade", "sync"],
  react: "👑",
  desc: "Update the bot to the latest version (auto restart for Heroku).",
  category: "misc",
  filename: __filename
}, async (client, message, args, { reply, isOwner }) => {
  if (!isOwner)
    return reply("*❌ YE COMMAND SIRF OWNER KE LIYE HAI!*");

  try {
    await reply("*🔍 CHECKING FOR NEW BiLAL-MD VERSION...*");

    // ✅ Correct GitHub repo
    const { data: commitData } = await axios.get(
      "https://api.github.com/repos/BilalTech05/BILAL-MD/commits/main"
    );
    const latestCommitHash = commitData.sha;

    // ✅ Current version
    const currentHash = await getCommitHash();

    if (latestCommitHash === currentHash) {
      return reply("*✅ APKA BILAL-MD BOT ALREADY UPDATED HAI ❤️*");
    }

    await reply("*🚀 UPDATING BILAL-MD BOT...*");

    // ✅ Download new ZIP
    const zipPath = path.join(__dirname, "latest.zip");
    const { data: zipData } = await axios.get(
      "https://github.com/BilalTech05/BILAL-MD/archive/refs/heads/main.zip",
      { responseType: "arraybuffer" }
    );
    fs.writeFileSync(zipPath, zipData);

    // ✅ Extract
    await reply("*📦 EXTRACTING NEW FILES...*");
    const extractPath = path.join(__dirname, "latest");
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(extractPath, true);

    // ✅ Copy files (skip config + app.json)
    const sourcePath = path.join(extractPath, "BILAL-MD-main");
    const destinationPath = path.join(__dirname, "..");
    copyFolderSync(sourcePath, destinationPath);

    // ✅ Save commit
    await setCommitHash(latestCommitHash);

    // ✅ Cleanup
    fs.unlinkSync(zipPath);
    fs.rmSync(extractPath, { recursive: true, force: true });

    // ✅ Try restart (if Heroku vars exist)
    if (HEROKU_APP && HEROKU_API) {
      await reply("*🔄 DEPLOYING NEW VERSION ON HEROKU...*");
      await restartHerokuApp();
      await reply("*✅ BILAL-MD BOT UPDATED & RESTARTING ON HEROKU 💥*");
    } else {
      await reply("*✅ BILAL-MD UPDATED SUCCESSFULLY! MANUAL RESTART REQUIRED 🔁*");
    }

  } catch (error) {
    console.error("Update error:", error);
    return reply("*❌ BOT UPDATE FAILED — TRY MANUALLY 🥺♥️*");
  }
});

// ────────────────────────────────
// Helper: Copy folders safely
// ────────────────────────────────
function copyFolderSync(source, target) {
  if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true });
  const items = fs.readdirSync(source);
  for (const item of items) {
    const srcPath = path.join(source, item);
    const destPath = path.join(target, item);

    if (["config.js", "app.json"].includes(item)) {
      console.log(`⏭️ Skipping ${item} to preserve settings.`);
      continue;
    }

    if (fs.lstatSync(srcPath).isDirectory()) {
      copyFolderSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// ────────────────────────────────
// Helper: Restart Heroku App
// ────────────────────────────────
async function restartHerokuApp() {
  const headers = {
    Accept: "application/vnd.heroku+json; version=3",
    Authorization: `Bearer ${HEROKU_API}`,
  };
  await axios.delete(`https://api.heroku.com/apps/${HEROKU_APP}/dynos`, { headers });
}
