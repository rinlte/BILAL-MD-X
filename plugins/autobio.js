const { cmd } = require("../command");

// 🧠 Auto Bio Updater
cmd({
  pattern: "autobio",
  alias: ["bioauto", "setautobio"],
  desc: "Enable or disable automatic bio updates with uptime.",
  category: "owner",
  react: "🕒",
  filename: __filename
}, async (conn, m, store, { reply, args }) => {
  try {
    if (!m.key.fromMe) return reply("❌ Only the owner can use this command!");

    const state = args[0]?.toLowerCase();
    if (!state || !["on", "off"].includes(state))
      return reply("📘 Usage:\n.autobio on\n.autobio off");

    global.autoBio = state === "on";
    reply(`✅ Auto Bio is now *${state.toUpperCase()}*!`);

    if (state === "on") {
      updateBio(conn); // start first update
    }

  } catch (e) {
    console.error("❌ AutoBio Error:", e);
    reply("⚠️ Something went wrong while updating autobio.");
  }
});

// 🕐 Bio Updater Function
async function updateBio(conn) {
  if (!global.autoBio) return;

  try {
    const uptime = process.uptime();
    const muptime = clockString(uptime * 1000);
    const botname = global.config?.botname || "BILAL-MD";

    const bio = `👑 BILAL-MD IS ACTIVE (${muptime})`;
    await conn.updateProfileStatus(bio);
    console.log(`✅ Updated bio: ${bio}`);
  } catch (err) {
    console.error("⚠️ Failed to update bio:", err.message);
  }

  // Update every 1 minute
  setTimeout(() => updateBio(conn), 60 * 1000);
}

// ⏱️ Time Formatter
function clockString(ms) {
  const d = Math.floor(ms / 86400000);
  const h = Math.floor(ms / 3600000) % 24;
  const m = Math.floor(ms / 60000) % 60;
  const s = Math.floor(ms / 1000) % 60;

  let str = "";
  if (d) str += `${d}D `;
  if (h) str += `${h}H `;
  if (m) str += `${m}M `;
  if (s) str += `${s}S`;
  return str.trim();
}
