const fs = require("fs");
const path = require("path");
const { cmd } = require('../command');

const bgmFile = path.join(__dirname, "../data/bgm.json");

// Load BGMs
function loadBgm() {
    if (!fs.existsSync(bgmFile)) return {};
    return JSON.parse(fs.readFileSync(bgmFile));
}

// Save BGMs
function saveBgm(data) {
    fs.writeFileSync(bgmFile, JSON.stringify(data, null, 2));
}

// Manage BGMs
cmd({
    pattern: "bgm",
    desc: "Manage BGMs (add/list/del)",
    category: "fun",
    react: "🎶",
    filename: __filename
},
async (conn, mek, m, { from, reply, args, quoted, isOwner }) => {
    try {
        let bgmAudios = loadBgm();

        // Show list
        if (args[0] === "list") {
            let list = Object.keys(bgmAudios).map(n => `• ${n}`).join("\n");
            return reply(list ? "*🎶 Saved BGMs:*\n" + list : "❌ No BGMs saved yet.");
        }

        // Delete audio (owner only)
        if (args[0] === "del") {
            if (!isOwner) return reply("❌ Only Owner can delete audios.");
            if (!args[1]) return reply("❌ Usage: bgm del <name>");
            const name = args[1].toLowerCase();
            if (!bgmAudios[name]) return reply("❌ No audio found for this name.");
            delete bgmAudios[name];
            saveBgm(bgmAudios);
            return reply(`🗑️ Deleted BGM: *${name}*`);
        }

        // Add new audio
        if (args[0] === "add") {
            if (!args[1]) return reply("❌ Usage: bgm add <name> (reply to an audio)");
            if (!quoted || !quoted.message || !quoted.message.audioMessage)
                return reply("❌ Reply to an audio to save it.");

            const name = args[1].toLowerCase();
            const filePath = await conn.downloadAndSaveMediaMessage(quoted);

            // Multiple names can point to the same file
            bgmAudios[name] = filePath;
            saveBgm(bgmAudios);

            return reply(`✅ Voice saved for name: *${name}*`);
        }

        reply("❌ Usage:\nReply to an audio: bgm add <name>\nList audios: bgm list\nDelete: bgm del <name>");
    } catch (e) {
        reply("❌ Error: " + e.message);
    }
});

// Auto BGM Trigger (no command, just text)
cmd({
    pattern: ".*",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, body }) => {
    try {
        if (!body) return;
        const bgmAudios = loadBgm();
        const text = body.trim().toLowerCase(); // case-insensitive

        for (let key of Object.keys(bgmAudios)) {
            if (key.toLowerCase() === text) {
                await conn.sendMessage(from, {
                    audio: { url: bgmAudios[key] },
                    mimetype: "audio/mpeg",
                    ptt: true
                }, { quoted: mek });
                break;
            }
        }
    } catch (e) {
        console.log("BGM auto error:", e.message);
    }
});
