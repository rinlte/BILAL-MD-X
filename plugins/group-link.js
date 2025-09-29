const { cmd, commands } = require('../command');
const config = require('../config');
const prefix = config.PREFIX;
const fs = require('fs');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson } = require('../lib/functions2');
const { writeFileSync } = require('fs');
const path = require('path');

cmd({
    pattern: "invite",
    alias: ["glink", "grouplink"],
    desc: "Get group invite link.",
    category: "group", // Already group
    filename: __filename,
}, async (conn, mek, m, { from, quoted, body, args, q, isGroup, sender, reply }) => {
    try {
        // Ensure this is being used in a group
        if (!isGroup) return reply("*YEH COMMAND SIRF GROUPS ME USE KAREIN ☺️❤️*");

        // Get the sender's number
        const senderNumber = sender.split('@')[0];
        const botNumber = conn.user.id.split(':')[0];
        
        // Check if the bot is an admin
        const groupMetadata = isGroup ? await conn.groupMetadata(from) : '';
        const groupAdmins = groupMetadata ? groupMetadata.participants.filter(member => member.admin) : [];
        const isBotAdmins = isGroup ? groupAdmins.some(admin => admin.id === botNumber + '@s.whatsapp.net') : false;
        
        if (!isBotAdmins) return reply("*YEH COMMAND SIRF GROUP ADMINS USE KAR SAKTE HAI ☺️❤️*");

        // Check if the sender is an admin
        const isAdmins = isGroup ? groupAdmins.some(admin => admin.id === sender) : false;
        if (!isAdmins) return reply("*PEHLE MUJHE IS GROUP ME ADMIN BANAO ☺️❤️*");

        // Get the invite code and generate the link
        const inviteCode = await conn.groupInviteCode(from);
        if (!inviteCode) return reply("*DUBARA KOSHISH KAREIN 🥺❤️*");

        const inviteLink = `https://chat.whatsapp.com/${inviteCode}`;

        // Reply with the invite link
        return reply(`* 🌹 GROUP INVITED LINK 🌹* \n${inviteLink}`);
        
    } catch (error) {
        console.error("*DUBARA KOSHISH KAREIN 🥺❤️*", error);
        reply(`*DUBARA KOSHISH KAREIN 🥺❤️* ${error.message || "Unknown error"}`);
    }
});

