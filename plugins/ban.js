const fs = require("fs");
const path = require("path");
const { cmd } = require("../command");

const BAN_FILE = path.join(__dirname, "../lib/ban.json");

// Ensure ban.json exists
if (!fs.existsSync(BAN_FILE)) fs.writeFileSync(BAN_FILE, JSON.stringify([]));

cmd({
    pattern: "ban",
    alias: ["blockuser", "addban"],
    desc: "Ban a user from using the bot",
    category: "owner",
    react: "⛔",
    filename: __filename
}, async (conn, mek, m, { from, args, isCreator, reply }) => {
    try {
        if (!isCreator) return reply("_❗Sirf owner use kar sakta hai ye command._");

        let target = m.mentionedJid?.[0] 
            || m.quoted?.sender 
            || (args[0] ? args[0].replace(/[^0-9]/g, '') + "@s.whatsapp.net" : null);

        if (!target) return reply("❌ Kisi user ko tag karo ya reply karo.");

        let banned = JSON.parse(fs.readFileSync(BAN_FILE));
        if (banned.includes(target)) return reply("🚫 Ye user already banned hai.");

        banned.push(target);
        fs.writeFileSync(BAN_FILE, JSON.stringify([...new Set(banned)], null, 2));

        await conn.sendMessage(from, {
            image: { url: "https://files.catbox.moe/vcdwmp.jpg" },
            caption: `⛔ *User banned successfully!*`
        }, { quoted: mek });
    } catch (err) {
        console.error(err);
        reply("❌ Error: " + err.message);
    }
});

cmd({
    pattern: "unban",
    alias: ["removeban"],
    desc: "Unban a user",
    category: "owner",
    react: "✅",
    filename: __filename
}, async (conn, mek, m, { from, args, isCreator, reply }) => {
    try {
        if (!isCreator) return reply("_❗Sirf owner use kar sakta hai ye command._");

        let target = m.mentionedJid?.[0] 
            || m.quoted?.sender 
            || (args[0] ? args[0].replace(/[^0-9]/g, '') + "@s.whatsapp.net" : null);

        if (!target) return reply("❌ Kisi user ko tag karo ya reply karo.");

        let banned = JSON.parse(fs.readFileSync(BAN_FILE));
        if (!banned.includes(target)) return reply("✅ Ye user banned nahi hai.");

        banned = banned.filter(u => u !== target);
        fs.writeFileSync(BAN_FILE, JSON.stringify(banned, null, 2));

        await conn.sendMessage(from, {
            image: { url: "https://files.catbox.moe/vcdwmp.jpg" },
            caption: `✅ *User unbanned successfully!*`
        }, { quoted: mek });
    } catch (err) {
        console.error(err);
        reply("❌ Error: " + err.message);
    }
});

cmd({
    pattern: "listban",
    alias: ["banlist", "bannedusers"],
    desc: "List all banned users",
    category: "owner",
    react: "📋",
    filename: __filename
}, async (conn, mek, m, { from, isCreator, reply }) => {
    try {
        if (!isCreator) return reply("_❗Sirf owner use kar sakta hai ye command._");

        let banned = JSON.parse(fs.readFileSync(BAN_FILE));
        if (banned.length === 0) return reply("✅ Koi bhi user banned nahi hai.");

        let msg = `*⛔ Banned Users List:*\n\n`;
        banned.forEach((id, i) => msg += `${i + 1}. wa.me/${id.replace("@s.whatsapp.net", "")}\n`);

        await conn.sendMessage(from, { text: msg }, { quoted: mek });
    } catch (err) {
        console.error(err);
        reply("❌ Error: " + err.message);
    }
});
