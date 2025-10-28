const fs = require('fs');
const path = require('path');
const { exec } = require("child_process");
const { cmd } = require('../command');
const { sleep } = require('../lib/functions');

// 🗂️ JSON file path (inside plugins folder)
const statusFile = path.join(__dirname, './autotyping-status.json');

// ✅ Create status file if not exists
if (!fs.existsSync(statusFile)) {
  fs.writeFileSync(statusFile, JSON.stringify({ enabled: false }, null, 2));
}

// 🔄 Load current status
let typingStatus = JSON.parse(fs.readFileSync(statusFile));

// 💾 Save function
function saveStatus() {
  fs.writeFileSync(statusFile, JSON.stringify(typingStatus, null, 2));
}

// 👇 Auto Typing when message received
cmd({ on: "body" }, async (conn, mek, m, { from }) => {
  if (typingStatus.enabled) {
    await conn.sendPresenceUpdate('composing', from);
  }
});

// 👑 .composing command
cmd({
  pattern: "composing",
  desc: "Enable, disable or check auto typing (pm2 restart)",
  category: "settings",
  react: "⌨️",
  filename: __filename
},
async (conn, mek, m, { from, args, reply, isOwner }) => {
  try {
    if (!isOwner) return reply("❌ Sirf owner is command ka use kar sakta hai.");

    const input = (args[0] || "").toLowerCase();

    // 🧭 Agar sirf .composing likha gaya hai (bina argument)
    if (!input) {
      return reply(
        `🧠 *Auto Typing Control*\n\n` +
        `Use these commands:\n` +
        `> .composing on — Enable auto typing\n` +
        `> .composing off — Disable auto typing\n` +
        `> .composing status — Check current status\n\n` +
        `Current Status: ${typingStatus.enabled ? "✅ *ON*" : "❌ *OFF*"}`
      );
    }

    // 🟢 Status check
    if (input === "status") {
      return reply(`💡 Auto Typing is currently: ${typingStatus.enabled ? "✅ *ON*" : "❌ *OFF*"}`);
    }

    // 🟢 Turn ON
    if (input === "on") {
      typingStatus.enabled = true;
      saveStatus();
      await reply("✅ Auto Typing *Enabled* successfully!\n🔁 Restarting bot...");
      await sleep(1500);

      exec("pm2 restart all", (err) => {
        if (err) {
          console.error(err);
          return reply(`❌ Error restarting bot:\n${err.message}`);
        }
      });
      return;
    }

    // 🔴 Turn OFF
    if (input === "off") {
      typingStatus.enabled = false;
      saveStatus();
      await reply("❌ Auto Typing *Disabled* successfully!\n🔁 Restarting bot...");
      await sleep(1500);

      exec("pm2 restart all", (err) => {
        if (err) {
          console.error(err);
          return reply(`❌ Error restarting bot:\n${err.message}`);
        }
      });
      return;
    }

    // ⚠️ Invalid argument
    reply(`⚙️ Usage:\n.composing on\n.composing off\n.composing status`);

  } catch (e) {
    console.error(e);
    reply(`❌ ${e}`);
  }
});
