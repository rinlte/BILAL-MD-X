const { cmd } = require('../command');

cmd({
    pattern: "promote",
    alias: ["p", "makeadmin", "admin"],
    desc: "Promotes a member to group admin",
    category: "admin",
    react: "👑",
    filename: __filename
},
async(conn, mek, m, {
    from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator, isDev, isAdmins, reply
}) => {
    // Check if the command is used in a group
    if (!isGroup) return reply("*YEH COMMAND SIRF GROUPS ME USE KAREIN ☺️❤️*");

    // Check if the user is an admin
    if (!isAdmins) return reply("");

    // Check if the bot is an admin
    if (!isBotAdmins) return reply("*PEHLE MUJHE IS GROUP ME ADMIN BANAO ☺️❤️*");

    let number;
    if (m.quoted) {
        number = m.quoted.sender.split("@")[0]; // If replying to a message, get the sender's number
    } else if (q && q.includes("@")) {
        number = q.replace(/[@\s]/g, ''); // If manually typing a number
    } else {
        return reply("*AP KIS MEMBER KO IS GROUP KA ADMIN BANANA CHAHTE HAI 🤔* \n *PEHLE US MEMBER KO MENTION USE MSG KO REPLY KAR KE ☺️🌹* \n *PHIR ESE LIKHO 🥰* \n \n *❮ADMIN❯* \n \n *TO WO MEMBER GROUP ME ADMIN BAN JAYE GA 😇♥️*");
    }

    // Prevent promoting the bot itself
    if (number === botNumber) return reply("*SORRY G IS MEMBER KO ADMIN NAHI BANA SAKTE 🥺🌹*");

    const jid = number + "@s.whatsapp.net";

    try {
        await conn.groupParticipantsUpdate(from, [jid], "promote");
        reply(`*YEH ${number} SIMPLE MEMBER SE ADMIN BAN CHUKA HAI 🥰🌹*`, { mentions: [jid] });
    } catch (error) {
        console.error("*DUBARA KOSHISH KAREIN 🥺❤️*", error);
        reply("*DUBARA KOSHISH KAREIN 🥺❤️*");
    }
});
