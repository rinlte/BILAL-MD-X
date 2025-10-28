const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const config = require("../config");
const { cmd } = require("../command");
const { sleep } = require("../lib/functions");

// 📁 Status file (inside plugins)
const statusFile = path.join(__dirname, "./autotyping-status.json");

// 🧾 Ensure file exists
if (!fs.existsSync(statusFile)) {
  fs.writeFileSync(statusFile, JSON.stringify({ enabled: false }, null, 2));
}

// 📊 Load status
let typingStatus = JSON.parse(fs.readFileSync(statusFile));

// 💾 Save helper
function saveStatus() {
  fs.writeFileSync(statusFile, JSON.stringify(typingStatus, null, 2));
}

// ✨ Auto typing when any message arrives
cmd({ on: "body" }, async (conn, mek, m, { from }) => {
  if (typingStatus.enabled) {
    await conn.sendPresenceUpdate("composing", from);
  }
});

// ⚙️ Main control command
cmd({
  pattern: "composing",
  desc: "Enable, disable, or check auto typing status",
  category: "settings",
  react: "⌨️",
  filename: __filename
}, async (conn, mek, m, extras) => {
  try {
    const { from, reply } = extras;

    // 🧩 Detect command text safely for all setups
    const fullText =
      (m.text ||
        m.message?.conversation ||
        m.message?.extendedTextMessage?.text ||
        extras?.body ||
        "")
        .toString()
        .trim();

    // 🔎 Extract argument after command name
    const match = fullText.replace(/^[.!/]?(composing)\s*/i, "").trim().toLowerCase();

    // 🔢 Get sender & owner numbers
    const sender = (m.sender || "").replace(/[^0-9]/g, "");
    let owners = config.OWNER_NUMBER || [];
    if (!Array.isArray(owners)) owners = [owners];
    owners = owners.map((num) => num.replace(/[^0-9]/g, ""));
    const isOwner = owners.some((num) => sender.endsWith(num.slice(-8)));

    if (!isOwner) {
      return reply("❌ Only *Bot Owner* can use this command.");
    }

    // ⚙️ If no argument, show help
    if (!match) {
      return reply(
        `⚙️ *Usage:*\n` +
          `.composing on\n` +
          `.composing off\n` +
          `.composing status\n\n` +
          `📊 Current: ${
            typingStatus.enabled ? "✅ *ON*" : "❌ *OFF*"
          }`
      );
    }

    // 📊 STATUS
    if (match === "status") {
      return reply(
        `💡 Auto Typing is currently: ${
          typingStatus.enabled ? "✅ *ON*" : "❌ *OFF*"
        }`
      );
    }

    // ✅ ON
    if (match === "on") {
      typingStatus.enabled = true;
      saveStatus();
      await reply("✅ Auto Typing *Enabled!* Restarting bot...");
      await sleep(1500);
      exec("pm2 restart all", (err) => {
        if (err) return reply(`❌ Restart failed:\n${err.message}`);
      });
      return;
    }

    // ❌ OFF
    if (match === "off") {
      typingStatus.enabled = false;
      saveStatus();
      await reply("❌ Auto Typing *Disabled!* Restarting bot...");
      await sleep(1500);
      exec("pm2 restart all", (err) => {
        if (err) return reply(`❌ Restart failed:\n${err.message}`);
      });
      return;
    }

    // ⚠️ Invalid option
    return reply(
      `⚙️ *Usage:*\n` +
        `.composing on\n` +
        `.composing off\n` +
        `.composing status`
    );
  } catch (e) {
    console.error(e);
    reply(`❌ Error: ${e.message}`);
  }
});
