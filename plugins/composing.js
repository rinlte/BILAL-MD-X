const { cmd } = require("../command");
const config = require("../config");

// Interval map for live typing
const typingIntervals = {};

cmd({
  pattern: "composing",
  desc: "Enable/disable/check AUTO_TYPING with live presence",
  category: "settings",
  react: "❤️",
  filename: __filename
}, async (conn, mek, m, extras) => {
  const { reply } = extras;

  try {
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

    // Guidance message if no argument
    if (!arg) {
      return reply(
        `⚙️ *Composing Command Help*\n\n` +
        `📤 *Usage:*\n` +
        `• .composing on → Enable AUTO_TYPING\n` +
        `• .composing off → Disable AUTO_TYPING\n` +
        `• .composing status → Check current status`
      );
    }

    switch (arg) {
      case "on":
        config.AUTO_TYPING = true;
        reply("✅ AUTO_TYPING is now ON\n📝 Live typing enabled");

        // Start live typing interval
        if (!typingIntervals["global"]) {
          typingIntervals["global"] = setInterval(async () => {
            try {
              // Send composing to every active chat
              if (conn.chats) {
                for (const jid of Object.keys(conn.chats)) {
                  await conn.sendPresenceUpdate("composing", jid);
                }
              }
            } catch (e) { console.error("Typing interval error:", e); }
          }, 5000); // every 5s
        }
        break;

      case "off":
        config.AUTO_TYPING = false;
        reply("❌ AUTO_TYPING is now OFF\n🛑 Live typing disabled");

        // Stop interval
        if (typingIntervals["global"]) {
          clearInterval(typingIntervals["global"]);
          delete typingIntervals["global"];
        }
        break;

      case "status":
        reply(`💡 AUTO_TYPING is currently: ${config.AUTO_TYPING ? "✅ ON" : "❌ OFF"}`);
        break;

      default:
        return; // silently ignore invalid args
    }

  } catch (e) {
    console.error(e);
    reply(`❌ Error: ${e.message}`);
  }
});
