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
    await reply("_⏳ BILAL-MD BOT UPDATE HO RAHA HAI... PLEASE WAIT..._");

    // ✅ Fetch latest GitHub commit hash
    const { data: commitData } = await axios.get(
      "https://api.github.com/repos/BilalTech05/BILAL-MD/commits/main"
    );
    const latestHash = commitData.sha;
    const currentHash = await getCommitHash();

    // ✅ Already latest version
    if (latestHash === currentHash) {
      return reply("_✅ AAPKE PAAS BILAL-MD KA LATEST VERSION HAI! 🌹_");
    }

    const headers = {
      Accept: "application/vnd.heroku+json; version=3",
      Authorization: `Bearer ${HEROKU_API}`,
    };

    // ✅ Trigger new Heroku build (force fresh ZIP every time)
    const zipUrl = `https://github.com/BilalTech05/BILAL-MD/archive/refs/heads/main.zip?nocache=${Date.now()}`;

    const build = await axios.post(
      `https://api.heroku.com/apps/${HEROKU_APP}/builds`,
      {
        source_blob: {
          url: zipUrl,
          version: latestHash,
        },
      },
      { headers }
    );

    // ✅ Save new commit hash
    await setCommitHash(latestHash);

    // ✅ Wait a few seconds before restart
    setTimeout(async () => {
      try {
        await axios.delete(`https://api.heroku.com/apps/${HEROKU_APP}/dynos`, { headers });
      } catch (err) {
        console.error("Heroku Restart Error:", err.message);
      }
    }, 15000); // 15 seconds delay

    await reply("*✅ BILAL-MD UPDATED SUCCESSFULLY!* 🔁\n_Bot restarting automatically... Please wait 1–2 minutes._");

  } catch (err) {
    console.error("UPDATE ERROR:", err.response?.data || err.message);
    reply("*❌ UPDATE FAILED — PLEASE CHECK HEROKU VARS OR NETWORK CONNECTION!*");
  }
});
