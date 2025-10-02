const fs = require("fs");
const path = require("path");
const { cmd } = require("../command");

const dataDir = path.join(__dirname, "..", "data");
const bgmFile = path.join(dataDir, "bgm.json");
const bgmSwitchFile = path.join(dataDir, "bgm-switch.json");

// Ensure data folder/files exist
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(bgmFile)) fs.writeFileSync(bgmFile, JSON.stringify({}, null, 2));
if (!fs.existsSync(bgmSwitchFile)) fs.writeFileSync(bgmSwitchFile, JSON.stringify({ on: true }, null, 2));

function loadBgm() {
  return JSON.parse(fs.readFileSync(bgmFile));
}
function saveBgm(data) {
  fs.writeFileSync(bgmFile, JSON.stringify(data, null, 2));
}
function loadSwitch() {
  return JSON.parse(fs.readFileSync(bgmSwitchFile));
}
function saveSwitch(data) {
  fs.writeFileSync(bgmSwitchFile, JSON.stringify(data, null, 2));
}
function isUrl(str) {
  return /^https?:\/\//i.test(str);
}

// 🎶 Manage BGM Command
cmd({
  pattern: "bgm",
  desc: "Manage background music (add/list/on/off)",
  category: "fun",
  react: "🎶",
  filename: __filename
},
async (conn, mek, m, { from, reply, args, quoted, isOwner }) => {
  try {
    let bgmAudios = loadBgm();
    let switchState = loadSwitch();

    if (!args[0]) {
      return reply(
        "🎶 *BGM Commands:*\n\n" +
        "➤ bgm add <name> (reply to audio)\n" +
        "➤ bgm list\n" +
        "➤ bgm on / bgm off"
      );
    }

    // Toggle ON/OFF
    if (args[0] === "on") {
      if (!isOwner) return reply("❌ Only owner can toggle.");
      switchState.on = true;
      saveSwitch(switchState);
      return reply("✅ BGM is now *ON*");
    }
    if (args[0] === "off") {
      if (!isOwner) return reply("❌ Only owner can toggle.");
      switchState.on = false;
      saveSwitch(switchState);
      return reply("❌ BGM is now *OFF*");
    }

    // List BGMs
    if (args[0] === "list") {
      let list = Object.keys(bgmAudios).map(n => `• ${n}`).join("\n");
      return reply(list ? "*🎶 Saved BGMs:*\n" + list : "❌ No BGMs saved.");
    }

    // Add BGM by replying audio
    if (args[0] === "add") {
      if (!args[1]) return reply("❌ Usage: bgm add <name> (reply to audio)");

      const name = args[1].toLowerCase();

      // Proper quoted audio check
      if (!quoted || !(quoted.msg || quoted.message)) {
        return reply("❌ Reply to an audio/voice to save it.");
      }

      let mime = (quoted.msg || quoted.message).mimetype || "";
      if (!/audio/.test(mime)) {
        return reply("❌ Please reply to an audio/voice note.");
      }

      const filePath = await conn.downloadAndSaveMediaMessage(quoted);

      // Allow multiple names -> same file
      bgmAudios[name] = filePath;
      saveBgm(bgmAudios);

      return reply(`✅ Voice linked with name: *${name}*`);
    }

  } catch (e) {
    reply("❌ Error: " + e.message);
  }
});

// 🎶 Auto BGM Trigger
cmd({
  pattern: ".*",
  dontAddCommandList: true,
  filename: __filename
},
async (conn, mek, m, { from, body }) => {
  try {
    let switchState = loadSwitch();
    if (!switchState.on) return; // ignore if OFF
    if (!body) return;

    let bgmAudios = loadBgm();
    const text = body.trim().toLowerCase();

    for (let key of Object.keys(bgmAudios)) {
      if (key.toLowerCase() === text) {
        let val = bgmAudios[key];
        if (isUrl(val)) {
          // Agar URL diya ho to bhi file as voice bhejna
          await conn.sendMessage(from, {
            audio: { url: val },
            mimetype: "audio/mpeg",
            ptt: true   // ✅ voice note style
          }, { quoted: mek });
        } else if (fs.existsSync(val)) {
          await conn.sendMessage(from, {
            audio: fs.readFileSync(val),
            mimetype: "audio/mpeg",
            ptt: true   // ✅ voice note style
          }, { quoted: mek });
        }
        break;
      }
    }
  } catch (e) {
    console.log("BGM auto error:", e.message);
  }
});
