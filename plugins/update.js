const { cmd } = require("../command");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");
const { setCommitHash, getCommitHash } = require("../data/updateDB");
const config = require("../config");

cmd({
  pattern: "update",
  alias: ["upgrade", "sync"],
  react: "👑",
  desc: "Update the bot to the latest version (auto restart for Heroku).",
  category: "misc",
  filename: __filename
}, async (client, message, args, { reply, isOwner }) => {

  if (!isOwner) return reply("*❌ YE COMMAND SIRF OWNER KE LIYE HAI!*");

  const HEROKU_APP = process.env.HEROKU_APP_NAME || config.HEROKU_APP_NAME || "";
  const HEROKU_API = process.env.HEROKU_API_KEY || config.HEROKU_API_KEY || "";

  try {
    await reply("_UPDATING BILAL-MD BOT......_");

    // ✅ Latest Git commit
    const { data: commitData } = await axios.get("https://api.github.com/repos/BilalTech05/BILAL-MD/commits/main");
    const latestCommitHash = commitData.sha;

    // ✅ Current version
    const currentHash = await getCommitHash();

    if (latestCommitHash === currentHash) {
      return reply("_YEH BILAL-MD BOT KA LATEST VERSION HAI APKE PASS ☺️_");
    }

    // ✅ Download new ZIP
    const zipPath = path.join(__dirname, "latest.zip");
    const { data: zipData } = await axios.get(
      "https://github.com/BilalTech05/BILAL-MD/archive/refs/heads/main.zip",
      { responseType: "arraybuffer" }
    );
    fs.writeFileSync(zipPath, zipData);

    // ✅ Extract ZIP
    const extractPath = path.join(__dirname, "latest");
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(extractPath, true);

    // ✅ Copy files (skip sensitive ones)
    const sourcePath = path.join(extractPath, "BILAL-MD-main");
    const destinationPath = path.join(__dirname, "..");
    copyFolderSync(sourcePath, destinationPath);

    await setCommitHash(latestCommitHash);

    // Cleanup
    fs.unlinkSync(zipPath);
    fs.rmSync(extractPath, { recursive: true, force: true });

    // ✅ Heroku restart if vars exist
    if (HEROKU_APP && HEROKU_API) {
      await restartHerokuApp(HEROKU_APP, HEROKU_API);
    }

    await reply("_BILAL-MD BOT UPDATE HO CHUKA HAI 🥰🌹_  _AB APKE PAS BOT KA LATEST VERSION HAI ☺️🌹_");

  } catch (err) {
    console.error("Update error:", err);
    return reply("*❌ BOT UPDATE FAILED — TRY MANUALLY 🥺*");
  }
});

// ─────────── Helper: Copy folders safely ───────────
function copyFolderSync(source, target) {
  if (!fs.existsSync(target)) fs.mkdirSync(target, { recursive: true });
  const items = fs.readdirSync(source);
  for (const item of items) {
    const src = path.join(source, item);
    const dest = path.join(target, item);
    if (["config.js", "app.json"].includes(item)) continue;
    if (fs.lstatSync(src).isDirectory()) copyFolderSync(src, dest);
    else fs.copyFileSync(src, dest);
  }
}

// ─────────── Helper: Restart Heroku App ───────────
async function restartHerokuApp(appName, apiKey) {
  const headers = {
    Accept: "application/vnd.heroku+json; version=3",
    Authorization: `Bearer ${apiKey}`
  };
  await axios.delete(`https://api.heroku.com/apps/${appName}/dynos`, { headers });
}
