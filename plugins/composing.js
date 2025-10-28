const fs = require('fs');
const path = require('path');
const config = require('../config');
const { cmd, commands } = require('../command');

// File path for saving auto typing status
const statusFile = path.join(__dirname, '../lib/composing-status.json');

// Create file if not exists
if (!fs.existsSync(statusFile)) {
  fs.writeFileSync(statusFile, JSON.stringify({ enabled: config.AUTO_TYPING === 'true' }));
}

// Load status
let typingStatus = JSON.parse(fs.readFileSync(statusFile));

// Save function
function saveStatus() {
  fs.writeFileSync(statusFile, JSON.stringify(typingStatus, null, 2));
}

// 👇 Auto Typing (Triggered on message body)
cmd({ on: "body" }, async (conn, mek, m, { from }) => {
  if (typingStatus.enabled) {
    await conn.sendPresenceUpdate('composing', from);
  }
});

// 👇 Command to toggle typing status + Auto restart
cmd({
  pattern: "composing",
  desc: "Turn auto typing on or off (auto restart bot)",
  category: "settings",
  react: "🌟",
  filename: __filename
}, async (conn, mek, m, { from, args, reply, isOwner }) => {
  if (!isOwner) return reply("❌ Only Owner can use this command.");

  if (!args[0]) {
    return reply(`⚙️ Usage: composing on/off\n\nCurrent: ${composing.enabled ? "✅ ON" : "❌ OFF"}`);
  }

  const input = args[0].toLowerCase();

  if (input === "on") {
    typingStatus.enabled = true;
    saveStatus();
    await reply("✅ Auto Typing has been *Enabled*.\n🔁 Restarting bot to apply changes...");
    setTimeout(() => process.exit(0), 2000); // Restart after 2 seconds
  } 
  else if (input === "off") {
    typingStatus.enabled = false;
    saveStatus();
    await reply("❌ Auto Typing has been *Disabled*.\n🔁 Restarting bot to apply changes...");
    setTimeout(() => process.exit(0), 2000);
  } 
  else {
    reply("⚙️ Usage: .autotyping on/off");
  }
});
