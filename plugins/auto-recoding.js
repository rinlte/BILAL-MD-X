const axios = require('axios');
const { cmd } = require('../command');

cmd({
  pattern: "autorecord",
  desc: "Enable or disable auto recording presence",
  category: "tools",
  react: "🎙️",
  filename: __filename
},
async (conn, m, store, { from, q, reply }) => {
  try {
    if (!process.env.HEROKU_API_KEY || !process.env.HEROKU_APP_NAME) {
      return reply("*🚫 Heroku API Key ya App Name missing hai!*\n\nHeroku vars me in dono ko set karo:\n`HEROKU_API_KEY`\n`HEROKU_APP_NAME`");
    }

    if (!q) {
      return reply("⚙️ Use: *.autorecord on* ya *.autorecord off*");
    }

    const status = q.toLowerCase();
    if (status !== "on" && status !== "off") {
      return reply("❌ Sirf 'on' ya 'off' likho bhai");
    }

    const axiosConfig = {
      headers: {
        Accept: "application/vnd.heroku+json; version=3",
        Authorization: `Bearer ${process.env.HEROKU_API_KEY}`,
        "Content-Type": "application/json"
      }
    };

    const value = status === "on" ? "true" : "false";
    const response = await axios.patch(
      `https://api.heroku.com/apps/${process.env.HEROKU_APP_NAME}/config-vars`,
      { AUTO_RECORDING: value },
      axiosConfig
    );

    if (response.status === 200) {
      await conn.sendMessage(from, {
        text: `🎙️ *Auto Recording ${status === "on" ? "Enabled ✅" : "Disabled ❌"}*\nHeroku vars updated successfully!`
      }, { quoted: m });
    } else {
      await reply("⚠️ Heroku update failed!");
    }

  } catch (e) {
    console.error(e);
    await reply("❌ Error while updating Heroku vars!");
  }
});
