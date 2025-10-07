const { cmd } = require("../command");
const axios = require("axios");
const { getCommitHash, setCommitHash } = require("../data/updateDB");
const config = require("../config");

cmd({
  pattern: "update",
  desc: "Update the bot to the latest version from GitHub and restart Heroku automatically.",
  category: "misc",
  react: "👑",
  filename: __filename
}, async (client, message, args, { reply, isOwner }) => {

  if (!isOwner) return reply("*❌ YE COMMAND SIRF OWNER KE LIYE HAI!*");

  const HEROKU_APP = process.env.HEROKU_APP_NAME || config.HEROKU_APP_NAME || "";
  const HEROKU_API = process.env.HEROKU_API_KEY || config.HEROKU_API_KEY || "";

  if (!HEROKU_APP || !HEROKU_API)
    return reply("*⚠️ HEROKU_APP_NAME aur HEROKU_API_KEY vars missing hain!*");

  try {
    await reply("_UPDATING BILAL-MD BOT......_");

    // ✅ Latest commit check
    const { data: commitData } = await axios.get("https://api.github.com/repos/BilalTech05/BILAL-MD/commits/main");
    const latestHash = commitData.sha;
    const currentHash = await getCommitHash();

    if (latestHash === currentHash) {
      return reply("_YEH BILAL-MD BOT KA LATEST VERSION HAI APKE PASS ☺️_");
    }

    const headers = {
      Accept: "application/vnd.heroku+json; version=3",
      Authorization: `Bearer ${HEROKU_API}`,
    };

    // ✅ Trigger new Heroku build
    await axios.post(
      `https://api.heroku.com/apps/${HEROKU_APP}/builds`,
      {
        source_blob: {
          url: "https://github.com/BilalTech05/BILAL-MD/archive/refs/heads/main.zip"
        }
      },
      { headers }
    );

    // ✅ Commit save for version tracking
    await setCommitHash(latestHash);

    // ✅ Wait a little before restart (Heroku build lag)
    setTimeout(async () => {
      try {
        await axios.delete(`https://api.heroku.com/apps/${HEROKU_APP}/dynos`, { headers });
      } catch (err) {
        console.error("Restart error:", err.message);
      }
    }, 10000); // 10 sec delay

    // ✅ Reply after triggering update
    await reply("_BILAL-MD BOT UPDATE HO CHUKA HAI 🥰🌹_  _AB APKE PAS BOT KA LATEST VERSION HAI ☺️🌹_");

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    reply("*❌ UPDATE FAILED — PLEASE CHECK HEROKU VARS OR NETWORK!*");
  }
});
