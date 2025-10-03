const fs = require("fs");
const path = require("path");
const { cmd } = require("../command");
const config = require("../config");

// Path to store BGM state
const STATE_PATH = path.join(__dirname, "../data/bgm.json");

// Load or create BGM state
let bgmState = { enabled: true, name: "" };
if (fs.existsSync(STATE_PATH)) {
    try {
        bgmState = JSON.parse(fs.readFileSync(STATE_PATH, "utf-8"));
    } catch (e) {
        console.error("❌ ERROR reading bgm.json:", e.message);
    }
} else {
    fs.writeFileSync(STATE_PATH, JSON.stringify(bgmState));
}

// Command to toggle ON/OFF or set BGM name manually
cmd({
    pattern: "bgm",
    fromMe: false, // Owner can also set if you want
    desc: "Set background music ON/OFF or manually set BGM name"
}, async (m, { args }) => {
    try {
        const sender = m.key.remoteJid.split("@")[0];
        const OWNER_NUMBER = process.env.OWNER_NUMBER || config.OWNER_NUMBER || "923276650623";
        if (sender !== OWNER_NUMBER) return; // Only owner can toggle or set

        if (!args[0]) {
            // Toggle default
            bgmState.enabled = !bgmState.enabled;
            fs.writeFileSync(STATE_PATH, JSON.stringify(bgmState));
            return m.reply(`✅ BGM is now *${bgmState.enabled ? "ON" : "OFF"}*`);
        }

        const cmdArg = args[0].toLowerCase();
        if (cmdArg === "on") {
            bgmState.enabled = true;
            fs.writeFileSync(STATE_PATH, JSON.stringify(bgmState));
            return m.reply("✅ BGM turned ON");
        }
        if (cmdArg === "off") {
            bgmState.enabled = false;
            fs.writeFileSync(STATE_PATH, JSON.stringify(bgmState));
            return m.reply("✅ BGM turned OFF");
        }

        if (cmdArg === "set" && args[1]) {
            bgmState.name = args.slice(1).join(" ");
            fs.writeFileSync(STATE_PATH, JSON.stringify(bgmState));
            return m.reply(`✅ BGM set to name: ${bgmState.name}`);
        }

    } catch (e) {
        console.error("❌ ERROR in BGM command:", e);
        await m.reply("⚠️ Something went wrong!");
    }
});

// BGM handler: reply with voice to set
cmd({ on: "voice" }, async (conn, mek, m) => {
    try {
        if (!bgmState.enabled) return;
        if (!m.quoted?.audio && !m.quoted?.ptt) return; // Only reply to audio/voice

        // Extract quoted audio
        const audioMsg = m.quoted;
        const audioBuffer = await conn.downloadMediaMessage(audioMsg);

        if (!audioBuffer) return m.reply("❌ Unable to fetch audio from quoted message");

        // Save to tmp folder
        const fileName = (bgmState.name || Date.now()) + ".mp3";
        const filePath = path.join(__dirname, "../tmp", fileName);
        fs.writeFileSync(filePath, audioBuffer);

        await m.reply(`✅ BGM saved as "${bgmState.name || fileName}"`);

    } catch (e) {
        console.error("❌ BGM handler error:", e);
        await m.reply("⚠️ Something went wrong while setting BGM");
    }
});
