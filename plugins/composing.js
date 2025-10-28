const fs = require("fs");
const path = require("path");
const { cmd } = require("../command");
const config = require("../config");

// Status file
const statusFile = path.join(__dirname, "./autotyping-status.json");
if (!fs.existsSync(statusFile)) fs.writeFileSync(statusFile, JSON.stringify({ enabled: false }, null, 2));

let typingStatus = JSON.parse(fs.readFileSync(statusFile));

// Save helper
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
  pattern: "composing",
  desc: "Enable, disable, or check auto typing status",
  category: "settings",
  react: "⌨️",
  filename: __filename
}, async (conn, mek, m, extras) => {
  try {
    const { reply } = extras;

    // 🔹 Reliable message text extraction
    let text = "";
    if (m.text) text = m.text;
    else if (m.message?.conversation) text = m.message.conversation;
    else if (m.message?.extendedTextMessage?.text) text = m.message.extendedTextMessage.text;
    else if (extras.body) text = extras.body;
    text = text.toString().trim();

    // 🔹 Extract argument after command
    const match = text.replace(/^[.!/]?(composing)\s*/i, "").trim().toLowerCase();

    // 🔹 Check if sender is owner
    const sender = (m.sender || "").replace(/[^0-9]/g, "");
    let owners = config.OWNER_NUMBER || [];
    if (!Array.isArray(owners)) owners = [owners];
    owners = owners.map((num) => num.replace(/[^0-9]/g, ""));
    const isOwner = owners.some(num => sender.endsWith(num.slice(-8)));
    if (!isOwner) return reply("❌ Only *Bot Owner* can use this command.");

    // 🔹 If no argument, show usage
    if (!match) {
      return reply(
        `⚙️ *Usage:*\n` +
        `.composing on\n` +
        `.composing off\n` +
        `.composing status\n\n` +
        `📊 Current: ${typingStatus.enabled ? "✅ *ON*" : "❌ *OFF*"}`
      );
    }

    // ✅ ON
    if (match === "on") {
      if (typingStatus.enabled) return reply("⚠️ Auto Typing is already ON");
      typingStatus.enabled = true;
      saveStatus();
      return reply("✅ Auto Typing *Enabled!* (Live, no restart needed)");
    }

    // ❌ OFF
    if (match === "off") {
      if (!typingStatus.enabled) return reply("⚠️ Auto Typing is already OFF");
      typingStatus.enabled = false;
      saveStatus();
      return reply("❌ Auto Typing *Disabled!* (Live, no restart needed)");
    }

    // 📊 STATUS
    if (match === "status") {
      return reply(`💡 Auto Typing is currently: ${typingStatus.enabled ? "✅ *ON*" : "❌ *OFF*"}`);
    }

    // ⚠️ Invalid argument
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
