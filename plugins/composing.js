const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { cmd } = require("../command");
const { sleep } = require("../lib/functions");

const statusFile = path.join(__dirname, "./autotyping-status.json");

// ✅ Create status file if not exist
if (!fs.existsSync(statusFile)) {
  fs.writeFileSync(statusFile, JSON.stringify({ enabled: false }, null, 2));
}

let typingStatus = JSON.parse(fs.readFileSync(statusFile));

function saveStatus() {
  fs.writeFileSync(statusFile, JSON.stringify(typingStatus, null, 2));
}

// 👇 Auto Typing On Message
cmd(
  { on: "body" },
  async (conn, mek, m, { from }) => {
    if (typingStatus.enabled) {
      await conn.sendPresenceUpdate("composing", from);
    }
  }
);

// 👇 Main Command
cmd(
  {
    pattern: "composing",
    desc: "Control Auto Typing (ON/OFF/STATUS)",
    category: "settings",
    react: "⌨️",
    filename: __filename,
  },
  async (conn, mek, m, extra) => {
    try {
      const text = (m.text || "").trim();
      const args = text.split(" ").slice(1); // manual split
      const input = (args[0] || "").toLowerCase();
      const from = extra?.from || mek.chat || m.key.remoteJid;
      const sender = m.sender || mek.sender || "";
      const isOwner =
        global.ownernumber?.includes(sender.split("@")[0]) || false;

      const reply = async (msg) => await conn.sendMessage(from, { text: msg }, { quoted: mek });

      // 🧠 No Argument → Show Guide
      if (!input) {
        return reply(
          `🧠 *Auto Typing Control Panel*\n\n` +
            `Use:\n` +
            `> .composing on — Enable auto typing\n` +
            `> .composing off — Disable auto typing\n` +
            `> .composing status — Show current state\n\n` +
            `📊 Current: ${
              typingStatus.enabled ? "✅ *ON*" : "❌ *OFF*"
            }`
        );
      }

      // ❌ Owner Restriction
      if (!isOwner) return reply("❌ Only *Bot Owner* can use this command.");

      // 📊 STATUS
      if (input === "status") {
        return reply(
          `💡 Auto Typing is currently: ${
            typingStatus.enabled ? "✅ *ON*" : "❌ *OFF*"
          }`
        );
      }

      // ✅ ON
      if (input === "on") {
        typingStatus.enabled = true;
        saveStatus();
        await reply("✅ Auto Typing *Enabled!* Restarting bot...");
        await sleep(1500);
        exec("pm2 restart all", (err) => {
          if (err) reply(`❌ Restart failed:\n${err.message}`);
        });
        return;
      }

      // ❌ OFF
      if (input === "off") {
        typingStatus.enabled = false;
        saveStatus();
        await reply("❌ Auto Typing *Disabled!* Restarting bot...");
        await sleep(1500);
        exec("pm2 restart all", (err) => {
          if (err) reply(`❌ Restart failed:\n${err.message}`);
        });
        return;
      }

      // ⚠️ Invalid Input
      reply("⚙️ Usage:\n.composing on\n.composing off\n.composing status");
    } catch (e) {
      console.log("Composing Error:", e);
    }
  }
);
