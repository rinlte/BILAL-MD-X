const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')

cmd({
    pattern: "unmute",
    alias: ["groupunmute", "opengc", "gcopen", "open"],
    react: "😃",
    desc: "Unmute the group (Everyone can send messages).",
    category: "group",
    filename: __filename
},           
async (conn, mek, m, { from, isGroup, senderNumber, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply("*YEH COMMAND SIRF GROUPS ME USE KAREIN ☺️❤️*");
        if (!isAdmins) return reply("*YEH COMMAND SIRF GROUP ADMINS USE KAR SAKTE HAI ☺️❤️*");
        if (!isBotAdmins) return reply("*PEHLE MUJHE IS GROUP ME ADMIN BANAO ☺️❤️*");

        await conn.groupSettingUpdate(from, "not_announcement");
        reply("*YEH GROUP AB BAND HO CHUKA HAI 🥺* \n *AB AP SAB IS GROUP ME CHAT NAHI KAR SAKTE HAI 😇🌺* \n *AUR HA 🥺 IS GROUP ME LINKS ALLOWED NAHI TO LINK HARGIZ NAHI BHEJNA IS GROUP OK ☺️🌹*");
    } catch (e) {
        console.error("*DUBARA KOSHISH KAREIN 🥺❤️*", e);
        reply("*DUBARA KOSHISH KAREIN 🥺❤️*");
    }
});
