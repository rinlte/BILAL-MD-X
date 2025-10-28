const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { cmd } = require("../command");
const { sleep } = require("../lib/functions");

const statusFile = path.join(__dirname, "./autotyping-status.json");

// Create status file if missing
if (!fs.existsSync(statusFile)) {
  fs.writeFileSync(statusFile, JSON.stringify({ enabled: false }, null, 2));
}

let typingStatus = JSON.parse(fs.readFileSync(statusFile));

function saveStatus() {
  fs.writeFileSync(statusFile, JSON.stringify(typingStatus, null, 2));
}

// 👇 Auto Typing Trigger
cmd(
  { on: "body" },
  async (conn, mek, m, { from }) => {
    if (typingStatus.enabled) {
      await conn.sendPresenceUpdate("composing", from);
    }
  }
);

// 👑 Composing Command
cmd(
  {
    pattern: "composing",
    desc: "Enable/Disable or Check Auto Typing (PM2 Restart)",
    category: "settings",
    react: "⌨️",
    filename: __filename,
  },
  async (conn, mek, m, context) => {
    try {
      const { reply } = context;
      const isOwner = context.isOwner || context.isCreator || false;
      const args = context.args || m.text.split(" ").slice(1); // fix for missing args

      if (!isOwner)
        return reply("❌ Only the *Bot Owner* can use this command.");

      const input = (args[0] || "").toLowerCase();

      // 📘 No argument → show guide
      if (!input) {
        return reply(
          `🧠 *Auto Typing Control Panel*\n\n` +
            `Use:\n` +
            `> .composing on — Enable auto typing\n` +
            `> .composing off — Disable auto typing\n` +
            `> .composing status — Check current state\n\n` +
            `📊 Current Status: ${
              typingStatus.enabled ? "✅ *ON*" : "❌ *OFF*"
            }`
        );
      }

      // 💡 Show current status
      if (input === "status") {
        return reply(
          `💡 Auto Typing is currently: ${
            typingStatus.enabled ? "✅ *ON*" : "❌ *OFF*"
          }`
        );
      }

      // ✅ Enable
      if (input === "on") {
        typingStatus.enabled = true;
        saveStatus();
        await reply(
          "✅ Auto Typing *Enabled Successfully!*\n🔁 Restarting bot..."
        );
        await sleep(1500);
        exec("pm2 restart all", (err) => {
          if (err) return reply(`❌ Restart Error:\n${err.message}`);
        });
        return;
      }

      // ❌ Disable
      if (input === "off") {
        typingStatus.enabled = false;
        saveStatus();
        await reply(
          "❌ Auto Typing *Disabled Successfully!*\n🔁 Restarting bot..."
        );
        await sleep(1500);
        exec("pm2 restart all", (err) => {
          if (err) return reply(`❌ Restart Error:\n${err.message}`);
        });
        return;
      }

      // ⚠️ Invalid Input
      reply("⚙️ Usage:\n.composing on\n.composing off\n.composing status");
    } catch (e) {
      console.error(e);
    }
  }
);
