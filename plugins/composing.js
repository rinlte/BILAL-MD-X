const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { cmd } = require("../command");
const { sleep } = require("../lib/functions");

const statusFile = path.join(__dirname, "./autotyping-status.json");

if (!fs.existsSync(statusFile)) {
  fs.writeFileSync(statusFile, JSON.stringify({ enabled: false }, null, 2));
}

let typingStatus = JSON.parse(fs.readFileSync(statusFile));
function saveStatus() {
  fs.writeFileSync(statusFile, JSON.stringify(typingStatus, null, 2));
}

// 👇 Auto typing trigger
cmd({ on: "body" }, async (conn, mek, m, { from }) => {
  if (typingStatus.enabled) {
    await conn.sendPresenceUpdate("composing", from);
  }
});

// 👇 Main command
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
      const args = text.split(" ").slice(1);
      const input = (args[0] || "").toLowerCase();
      const from = extra?.from || mek.chat || m.key.remoteJid;

      // ✅ extract sender & owner numbers
      const senderRaw = m.sender || mek.sender || "";
      const sender = senderRaw.replace(/[^0-9]/g, "");
      const ownerNumbers = (global.ownernumber || []).map((x) =>
        x.replace(/[^0-9]/g, "")
      );

      console.log("📞 Sender:", senderRaw);
      console.log("🧩 Clean Sender:", sender);
      console.log("👑 Owner Numbers:", ownerNumbers);

      const isOwner = ownerNumbers.some((num) => sender.endsWith(num));

      const reply = async (msg) =>
        await conn.sendMessage(from, { text: msg }, { quoted: mek });

      // 🧠 help text
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

      // ❌ Owner check
      if (!isOwner)
        return reply(
          `❌ Only *Bot Owner* can use this command.\n\n📞 Sender: ${sender}\n👑 Owners: ${ownerNumbers.join(", ")}`
        );

      if (input === "status") {
        return reply(
          `💡 Auto Typing is currently: ${
            typingStatus.enabled ? "✅ *ON*" : "❌ *OFF*"
          }`
        );
      }

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

      reply("⚙️ Usage:\n.composing on\n.composing off\n.composing status");
    } catch (e) {
      console.log("Composing Error:", e);
    }
  }
);
