const fs = require('fs');
const path = require('path');
const config = require('../config');
const { cmd, commands } = require('../command');

// 🗂️ File path for status (inside plugins folder)
const statusFile = path.join(__dirname, './autotyping-status.json');

// Create status file if not exists
if (!fs.existsSync(statusFile)) {
  fs.writeFileSync(statusFile, JSON.stringify({ enabled: config.AUTO_TYPING === 'true' }, null, 2));
}

// Load current status
let typingStatus = JSON.parse(fs.readFileSync(statusFile));

// Save function
function saveStatus() {
  fs.writeFileSync(statusFile, JSON.stringify(autotypingStatus, null, 2));
}

// 👇 Auto Typing Trigger (on any message)
cmd({ on: "body" }, async (conn, mek, m, { from }) => {
  if (typingStatus.enabled) {
    await conn.sendPresenceUpdate('composing', from);
  }
});

// 👇 Toggle / Status Command
cmd({
  pattern: "composing",
  desc: "Enable, disable or check auto typing status",
  category: "settings",
  react: "⌨️",
  filename: __filename
}, async (conn, mek, m, { from, args, reply, isOwner }) => {
  if (!isOwner) return reply("❌ Only Owner can use this command.");

  const input = (args[0] || "").toLowerCase();

  if (!input) {
    return reply(`⚙️ Usage:\n.autotyping on\n.autotyping off\n.autotyping status`);
  }

  if (input === "status") {
    return reply(`💡 Auto Typing is currently: ${typingStatus.enabled ? "✅ *ON*" : "❌ *OFF*"}`);
  }

  if (input === "on") {
    typingStatus.enabled = true;
    saveStatus();
    await reply("✅ Auto Typing has been *Enabled*.\n🔁 Restarting bot to apply changes...");
    return setTimeout(() => process.exit(0), 2000);
  }

  if (input === "off") {
    typingStatus.enabled = false;
    saveStatus();
    await reply("❌ Auto Typing has been *Disabled*.\n🔁 Restarting bot to apply changes...");
    return setTimeout(() => process.exit(0), 2000);
  }

  reply("⚙️ Usage:\n.autotyping on/off/status");
});
