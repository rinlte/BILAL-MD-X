const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const config = require("../config");
const { cmd } = require("../command");
const { sleep } = require("../lib/functions");

const statusFile = path.join(__dirname, "./autotyping-status.json");

// ✅ Ensure status file exists
if (!fs.existsSync(statusFile)) {
  fs.writeFileSync(statusFile, JSON.stringify({ enabled: false }, null, 2));
}

let typingStatus = JSON.parse(fs.readFileSync(statusFile));

function saveStatus() {
  fs.writeFileSync(statusFile, JSON.stringify(typingStatus, null, 2));
}

// 🟢 Auto Typing (when body event triggers)
cmd({ on: "body" }, async (conn, mek, m, { from }) => {
  if (typingStatus.enabled) {
    await conn.sendPresenceUpdate("composing", from);
  }
});

// 🧠 Main Command
cmd(
  {
    pattern: "composing",
    desc: "Control Auto Typing (ON/OFF/STATUS)",
    category: "settings",
    react: "⌨️",
    filename: __filename,
  },
  async (conn, mek, m, { from, isOwner, body }) => {
    try {
      // ✅ Fix input parsing (handles all cases)
      const fullText =
        (m?.text ||
          mek?.text ||
          body ||
          (m?.message?.conversation || "")).trim() || "";
      const args = fullText.split(/\s+/).slice(1);
      const input = (args[0] || "").toLowerCase();

      // ✅ Normalize numbers (for global owner detection)
      const sender = (m.sender || "").replace(/[^0-9]/g, "");
      let ownerNumbers = [];

      if (config.OWNER_NUMBER) {
        ownerNumbers = Array.isArray(config.OWNER_NUMBER)
          ? config.OWNER_NUMBER
          : [config.OWNER_NUMBER];
      }
      ownerNumbers = ownerNumbers.map((n) => n.replace(/[^0-9]/g, ""));

      const isBotOwner = ownerNumbers.some((n) => {
        const shortSender = sender.slice(-8);
        const shortOwner = n.slice(-8);
        return shortSender === shortOwner || sender.endsWith(n);
      });

      const reply = async (msg) =>
        conn.sendMessage(from, { text: msg }, { quoted: mek });

      // ⚙️ Help message (if no argument)
      if (!input) {
        return reply(
          `🧠 *Auto Typing Control Panel*\n\n` +
            `> .composing on — Enable auto typing\n` +
            `> .composing off — Disable auto typing\n` +
            `> .composing status — Show current state\n\n` +
            `📊 Current: ${
              typingStatus.enabled ? "✅ *ON*" : "❌ *OFF*"
            }`
        );
      }

      // ❌ Not owner
      if (!isBotOwner) {
        return reply(
          `❌ Only *Bot Owner* can use this command.\n\n📞 Sender: ${sender}\n👑 Owners: ${ownerNumbers.join(
            ", "
          )}`
        );
      }

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

      // ⚙️ Invalid input
      return reply(
        `⚙️ Usage:\n.composing on\n.composing off\n.composing status`
      );
    } catch (e) {
      console.error("❌ Composing Error:", e);
    }
  }
);
