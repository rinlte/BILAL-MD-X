const { cmd } = require('../command');

cmd({
    pattern: "demote",
    alias: ["d", "dismiss", "removeadmin"],
    desc: "Demotes a group admin to a normal member",
    category: "admin",
    react: "🥺",
    filename: __filename
},
async(conn, mek, m, {
    from, l, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isCreator, isDev, isAdmins, reply
}) => {
    // Check if the command is used in a group
    if (!isGroup) return reply("*YEH COMMAND SIRF GROUPS ME USE KAREIN ☺️❤️*");

    // Check if the user is an admin
    if (!isAdmins) return reply("*YEH COMMAND SIRF GROUP ADMINS USE KAR SAKTE HAI ☺️❤️*");

    // Check if the bot is an admin
    if (!isBotAdmins) return reply("*PEHLE MUJHE IS GROUP ME ADMIN BANAO ☺️❤️*");

    let number;
    if (m.quoted) {
        number = m.quoted.sender.split("@")[0]; // If replying to a message, get the sender's number
    } else if (q && q.includes("@")) {
        number = q.replace(/[@\s]/g, ''); // If manually typing a number
    } else {
        return reply("*AP NE KIS MEMBER KO ADMINS KI POST SE DISSMISS KARNA HAI 🥺❤️* \n *US ADMIN KO MENTION KARO 🥺❤️*");
    }

    // Prevent demoting the bot itself
    if (number === botNumber) return reply("*SORRY G IS ADMIN KO DISSMISS NAHI KAR SAKTE AP 🥺❤️*");

    const jid = number + "@s.whatsapp.net";

    try {
        await conn.groupParticipantsUpdate(from, [jid], "demote");
        reply(`APKO @${number} ADMIN SE DISSMISS KAR DYA GAYA HAI 🥺❤️`, { mentions: [jid] });
    } catch (error) {
        console.error("*DUBARA KOSHISH KAREIN 🥺❤️*", error);
        reply("*DUBARA KOSHISH KAREIN 🥺❤️*");
    }
});
