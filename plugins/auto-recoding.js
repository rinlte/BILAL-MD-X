const fs = require("fs");
const path = require("path");
const { cmd } = require("../command");

// File jahan state save hogi
const STATE_PATH = path.join(__dirname, "../data/autorecord.json");

// Default state
let autorecordState = { enabled: true };

// Load ya create file
try {
  if (fs.existsSync(STATE_PATH)) {
    autorecordState = JSON.parse(fs.readFileSync(STATE_PATH));
  } else {
    fs.writeFileSync(STATE_PATH, JSON.stringify(autorecordState, null, 2));
  }
} catch (err) {
  console.error("Error loading autorecord state:", err);
}

// Command to turn ON/OFF
cmd({
  pattern: "autorecord",
  desc: "Turn auto recording ON or OFF",
  category: "tools",
  react: "🎙️",
  filename: __filename,
}, async (conn, mek, m, { from, q, reply }) => {
  if (!q) return reply("📝 Use like:\n.autorecord on\n.autorecord off");

  const value = q.toLowerCase();
  if (value === "on") autorecordState.enabled = true;
  else if (value === "off") autorecordState.enabled = false;
  else return reply("❌ Sirf 'on' ya 'off' likho.");

  fs.writeFileSync(STATE_PATH, JSON.stringify(autorecordState, null, 2));

  await reply(`✅ Auto Recording is now *${value.toUpperCase()}*`);
  await conn.sendMessage(from, { react: { text: "🎧", key: mek.key } });
});

module.exports = { autorecordState };
