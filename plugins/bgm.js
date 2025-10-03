const fs = require("fs");
const path = require("path");
const { cmd } = require("../command");

const bgmFile = path.join(__dirname, "../data/bgm.json");
const voicesDir = path.join(__dirname, "../voices");

// Ensure voices folder exists
if (!fs.existsSync(voicesDir)) {
    fs.mkdirSync(voicesDir, { recursive: true });
}

// Load BGMs
function loadBgm() {
    if (!fs.existsSync(bgmFile)) return {};
    try {
        return JSON.parse(fs.readFileSync(bgmFile));
    } catch {
        return {};
    }
}

// Save BGMs
function saveBgm(data) {
    fs.writeFileSync(bgmFile, JSON.stringify(data, null, 2));
}

let bgmStatus = true; // on/off control

// Manage BGMs
cmd({
    pattern: "bgm",
    desc: "Manage BGMs (add/list/del/on/off)",
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

        // Turn on/off
        if (args[0] === "on") {
            bgmStatus = true;
            return reply("✅ BGM is now *ON*");
        }
        if (args[0] === "off") {
            bgmStatus = false;
            return reply("✅ BGM is now *OFF*");
        }

        // Delete audio (owner only)
        if (args[0] === "del") {
            if (!isOwner) return reply("❌ Only Owner can delete audios.");
            if (!args[1]) return reply("❌ Usage: bgm del <name>");
            const name = args[1].toLowerCase();
            if (!bgmAudios[name]) return reply("❌ No audio found for this name.");

            // delete file from voices folder
            try {
                if (fs.existsSync(bgmAudios[name])) {
                    fs.unlinkSync(bgmAudios[name]);
                }
            } catch {}
            delete bgmAudios[name];
            saveBgm(bgmAudios);
            return reply(`🗑️ Deleted BGM: *${name}*`);
        }

        // Add new audio
        if (args[0] === "add") {
            if (!args[1]) return reply("❌ Usage: reply to an audio with: bgm add <name>");
            if (!quoted || !quoted.message || (!quoted.message.audioMessage && !quoted.message.voiceMessage)) {
                return reply("❌ Reply to an *audio* to save it.");
            }

            const name = args[1].toLowerCase();
            const filePath = path.join(voicesDir, `${name}.mp3`);

            // download audio and save
            const buff = await conn.downloadMediaMessage(quoted);
            fs.writeFileSync(filePath, buff);

            // Multiple names can point to same file
            bgmAudios[name] = filePath;
            saveBgm(bgmAudios);

            return reply(`✅ Voice saved for name: *${name}*`);
        }

        reply("❌ Usage:\nReply audio: bgm add <name>\nList: bgm list\nDelete: bgm del <name>\nOn/Off: bgm on | bgm off");
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
        if (!body || !bgmStatus) return;
        const bgmAudios = loadBgm();
        const text = body.trim().toLowerCase();

        for (let key of Object.keys(bgmAudios)) {
            if (key.toLowerCase() === text) {
                await conn.sendMessage(from, {
                    audio: fs.readFileSync(bgmAudios[key]),
                    mimetype: "audio/mpeg"
                }, { quoted: mek });
                break;
            }
        }
    } catch (e) {
        console.log("BGM auto error:", e.message);
    }
});
