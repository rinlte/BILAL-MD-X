const axios = require("axios");
const config = require("../config");
const { cmd } = require("../command");

// 🔹 Heroku Config
const HEROKU_APP = config.HEROKU_APP_NAME || "";
const HEROKU_API = config.HEROKU_API_KEY || "";
const OWNER = config.OWNER_NUMBER || "";

// 🔹 Heroku API Base
const baseURL = `https://api.heroku.com/apps/${HEROKU_APP}/config-vars`;
const headers = {
  "Accept": "application/vnd.heroku+json; version=3",
  "Authorization": `Bearer ${HEROKU_API}`,
};

// 🔹 Function: Owner Check
function isOwner(sender) {
  return sender.replace(/[^0-9]/g, "") === OWNER.replace(/[^0-9]/g, "");
}

// 🔹 Command: Set Heroku Var
cmd({
  pattern: "setvar",
  desc: "WhatsApp se Heroku vars edit kare",
  category: "owner",
  use: ".setvar KEY=VALUE"
}, async (message, match) => {
  try {
    // 🔸 Owner check
    if (!isOwner(message.sender)) {
      return await message.reply("❌ Ye command sirf owner ke liye hai.");
    }

    if (!match.includes("=")) {
      return await message.reply("⚙️ Example:\n.setvar SESSION_ID=BILAL-MD~abc123xyz");
    }

    const [key, ...valueParts] = match.split("=");
    const keyName = key.trim().toUpperCase();
    const value = valueParts.join("=").trim();

    if (!keyName || !value) {
      return await message.reply("❌ Key ya Value sahi format me likho bhai.\nExample: .setvar PREFIX=.");
    }

    // 🔹 Patch request to Heroku
    await axios.patch(baseURL, { [keyName]: value }, { headers });

    await message.reply(`✅ Var *${keyName}* updated successfully!`);
  } catch (error) {
    console.error("❌ setvar error:", error.message);
    await message.reply("⚠️ Kuch ghalat ho gaya, var update nahi hua.");
  }
});
