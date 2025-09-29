const config = require('../config')
const { cmd, commands } = require('../command')
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')

cmd({
    pattern: "unlockgc",
    alias: ["unlock"],
    react: "☺️",
    desc: "Unlock the group (Allows new members to join).",
    category: "group",
    filename: __filename
},           
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply("*YEH COMMAND SIRF GROUPS ME USE KAREIN ☺️❤️*");
        if (!isAdmins) return reply("*YEH COMMAND SIRF GROUP ADMINS USE KAR SAKTE HAI ☺️❤️*");
        if (!isBotAdmins) return reply("*PEHLE MUJHE IS GROUP ME ADMIN BANAO ☺️❤️*");

        await conn.groupSettingUpdate(from, "unlocked");
        reply("*AB YE GROUP UNLOCK HO CHUKA HAI 😊🌺* \n *AB IS GROUP ME NEW MEMBERS JOIN KAR SAKTE HAI ☺️🌹*");
    } catch (e) {
        console.error("*DUBARA KOSHISH KAREIN 🥺❤️*", e);
        reply("*DUBARA KOSHISH KAREIN 🥺❤️*");
    }
});
