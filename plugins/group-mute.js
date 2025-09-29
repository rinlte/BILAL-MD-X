const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')

cmd({
    pattern: "mute",
    alias: ["groupmute", "offgroup", "groupoff", "offgc", "gcoff"],
    react: "🔒",
    desc: "Mute the group (Only admins can send messages).",
    category: "group",
    filename: __filename
},           
async (conn, mek, m, { from, isGroup, senderNumber, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply("*YEH COMMAND SIRF GROUPS ME USE KAREIN ☺️❤️*");
        if (!isAdmins) return reply("*YEH COMMAND SIRF GROUP ADMINS USE KAR SAKTE HAI ☺️❤️*");
        if (!isBotAdmins) return reply("*PEHLE MUJHE IS GROUP ME ADMIN BANAO ☺️❤️*");

        await conn.groupSettingUpdate(from, "announcement");
        reply("*YEH GROUP AB BAND HO CHUKA HAI ☺️🌹*");
    } catch (e) {
        console.error("*DUBARA KOSHISH KAREIN 🥺❤️*", e);
        reply("*DUBARA KOSHISH KAREIN 🥺❤️*");
    }
});
