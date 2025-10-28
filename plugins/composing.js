const fs = require("fs");
const path = require("path");
const { cmd } = require("../command");
const config = require("../config");

// Status file
const statusFile = path.join(__dirname, "./autotyping-status.json");
if (!fs.existsSync(statusFile)) fs.writeFileSync(statusFile, JSON.stringify({ enabled: false }, null, 2));

let typingStatus = JSON.parse(fs.readFileSync(statusFile));

function saveStatus() {
  fs.writeFileSync(statusFile, JSON.stringify(typingStatus, null, 2));
}

// Auto typing when any message arrives
cmd({ on: "body" }, async (conn, mek, m, { from }) => {
  if (typingStatus.enabled) {
    await conn.sendPresenceUpdate("composing", from);
  }
});

// Main command
cmd({
  pattern: "^composing(?:\\s+(.*))?$", // accept arguments
  desc: "Enable/disable/check auto typing",
  category: "settings",
  react: "⌨️",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    // Reliable text extraction
    let text = "";
    if (m.text) text = m.text;
    else if (m.message?.conversation) text = m.message.conversation;
    else if (m.message?.extendedTextMessage?.text) text = m.message.extendedTextMessage.text;
    text = text.trim();

    // Extract argument after command
    const match = text.match(/^\.?composing\s*(.*)/i);
    const cmdArg = (match?.[1] || "").toLowerCase().trim();

    // Owner check
    const sender = (m.sender || "").replace(/[^0-9]/g, "");
    let owners = config.OWNER_NUMBER || [];
    if (!Array.isArray(owners)) owners = [owners];
    owners = owners.map((num) => num.replace(/[^0-9]/g, ""));
    const isOwner = owners.some(num => sender.endsWith(num.slice(-8)));
    if (!isOwner) return reply("❌ Only *Bot Owner* can use this command.");

    // Handle commands
    if (!cmdArg) {
      return reply(
        `⚙️ *Usage:*\n` +
        `.composing on\n` +
        `.composing off\n` +
        `.composing status\n\n` +
        `📊 Current: ${typingStatus.enabled ? "✅ ON" : "❌ OFF"}`
      );
    }

    if (cmdArg === "on") {
      if (typingStatus.enabled) return reply("⚠️ Auto Typing is already ON");
      typingStatus.enabled = true;
      saveStatus();
      return reply("✅ Auto Typing Enabled (Live, no restart)");
    }

    if (cmdArg === "off") {
      if (!typingStatus.enabled) return reply("⚠️ Auto Typing is already OFF");
      typingStatus.enabled = false;
      saveStatus();
      return reply("❌ Auto Typing Disabled (Live, no restart)");
    }

    if (cmdArg === "status") {
      return reply(`💡 Auto Typing is currently: ${typingStatus.enabled ? "✅ ON" : "❌ OFF"}`);
    }

    // Invalid argument
    return reply(
      `⚠️ Invalid option!\nUsage:\n.composing on\n.composing off\n.composing status`
    );

  } catch (e) {
    console.error(e);
    reply(`❌ Error: ${e.message}`);
  }
});
