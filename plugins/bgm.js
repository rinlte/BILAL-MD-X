const fs = require("fs");
const path = require("path");
const { cmd } = require('../command');

const bgmFile = path.join(__dirname, "../data/bgm.json");

// ✅ Load JSON
function loadBgm() {
    if (!fs.existsSync(bgmFile)) {
        return { enabled: true, audios: {} };
    }
    return JSON.parse(fs.readFileSync(bgmFile));
}

// ✅ Save JSON
function saveBgm(data) {
    fs.writeFileSync(bgmFile, JSON.stringify(data, null, 2));
}

// ✅ Check URL
function isUrl(str) {
    try { new URL(str); return true; } catch { return false; }
}

// 🎶 BGM Management Command
cmd({
    pattern: "bgm",
    desc: "Manage BGM voices",
    category: "fun",
    react: "🎶",
    filename: __filename
},
async (conn, mek, m, { from, reply, args, quoted }) => {
    try {
        let data = loadBgm();

        if (!args[0]) {
            return reply("❌ Usage:\n- bgm add <name> (reply to audio)\n- bgm list\n- bgm on/off");
        }

        // 🔹 Enable/Disable
        if (args[0] === "on") {
            data.enabled = true;
            saveBgm(data);
            return reply("✅ BGM Auto-Reply *ON* ho gaya");
        }
        if (args[0] === "off") {
            data.enabled = false;
            saveBgm(data);
            return reply("🚫 BGM Auto-Reply *OFF* ho gaya");
        }

        // 🔹 List
        if (args[0] === "list") {
            let list = Object.keys(data.audios).map(n => `• ${n}`).join("\n");
            return reply(list ? "*🎶 Saved BGMs:*\n" + list : "❌ Abhi tak koi BGM save nahi hai.");
        }

        // 🔹 Add new BGM
        if (args[0] === "add") {
            if (!args[1]) return reply("❌ Usage: bgm add <name> (reply to audio)");
            const name = args[1].toLowerCase();

            let q = quoted ? (quoted.msg || quoted.message) : null;
            if (!q) return reply("❌ Audio pe reply karo.");

            let mime = q.mimetype || "";
            if (!/audio/.test(mime)) {
                return reply("❌ Sirf voice note/audio reply kiya ja sakta hai.");
            }

            // ✅ Save audio in /data folder
            const filePath = path.join(__dirname, `../data/bgm_${name}.mp3`);
            const buff = await conn.downloadMediaMessage(quoted);
            fs.writeFileSync(filePath, buff);

            // ✅ Update JSON
            data.audios[name] = filePath;
            saveBgm(data);

            return reply(`✅ Voice saved for: *${name}*`);
        }

        reply("❌ Invalid usage.");
    } catch (e) {
        reply("❌ Error: " + e.message);
    }
});

// 🎶 Auto Trigger: name likhne se voice bhejna
cmd({
    pattern: ".*",
    dontAddCommandList: true,
    filename: __filename
},
async (conn, mek, m, { from, body }) => {
    try {
        if (!body) return;
        let data = loadBgm();
        if (!data.enabled) return;

        const text = body.trim().toLowerCase();
        let audios = data.audios;

        // Agar JSON me name exist kare to send karo
        if (audios[text]) {
            let val = audios[text];
            if (isUrl(val)) {
                await conn.sendMessage(from, {
                    audio: { url: val },
                    mimetype: "audio/mpeg",
                    ptt: true
                }, { quoted: mek });
            } else if (fs.existsSync(val)) {
                await conn.sendMessage(from, {
                    audio: fs.readFileSync(val),
                    mimetype: "audio/mpeg",
                    ptt: true
                }, { quoted: mek });
            }
        }
    } catch (e) {
        console.log("BGM error:", e.message);
    }
});
