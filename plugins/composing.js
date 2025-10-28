const { cmd } = require("../command");
const config = require("../config");

cmd({
  pattern: "composing",
  desc: "Enable/disable/check AUTO_TYPING",
  category: "settings",
  react: "❤️",
  filename: __filename
}, async (conn, mek, m, extras) => {
  const { reply } = extras;

  try {
    // Reliable text extraction
    const text = m.text || m.message?.conversation || m.message?.extendedTextMessage?.text || "";
    const parts = text.trim().split(/\s+/);
    const cmdName = parts[0].replace(/^[.!/]/, "").toLowerCase();
    const arg = parts[1]?.toLowerCase();

    if (cmdName !== "composing") return;

    // Owner check
    const sender = (m.sender || "").replace(/[^0-9]/g, "");
    let owners = config.OWNER_NUMBER || [];
    if (!Array.isArray(owners)) owners = [owners];
    owners = owners.map(num => num.replace(/[^0-9]/g, ""));
    const isOwner = owners.some(num => sender.endsWith(num.slice(-8)));
    if (!isOwner) return;

    // If no argument, do nothing
    if (!arg) return;

    switch (arg) {
      case "on":
        config.AUTO_TYPING = true;
        return reply("✅ AUTO_TYPING is now ON");

      case "off":
        config.AUTO_TYPING = false;
        return reply("❌ AUTO_TYPING is now OFF");

      case "status":
        return reply(`💡 AUTO_TYPING is currently: ${config.AUTO_TYPING ? "✅ ON" : "❌ OFF"}`);

      default:
        return; // silently ignore invalid arguments
    }

  } catch (e) {
    console.error(e);
    reply(`❌ Error: ${e.message}`);
  }
});
    
