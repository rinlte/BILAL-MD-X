const { cmd } = require('../command');

cmd({
    pattern: "block",
    desc: "Blocks a person",
    category: "owner",
    react: "🙂",
    filename: __filename
},
async (conn, m, { reply, q, react }) => {
    // Get the bot owner's number dynamically
    const botOwner = conn.user.id.split(":")[0] + "@s.whatsapp.net";
    
    if (m.sender !== botOwner) {
        await react("🙋🏻");
        return reply("*YE COMMAND SIRF MERE LIE HAI OK ☺️🌹*");
    }

    let jid;
    if (m.quoted) {
        jid = m.quoted.sender; // If replying to a message, get sender JID
    } else if (m.mentionedJid.length > 0) {
        jid = m.mentionedJid[0]; // If mentioning a user, get their JID
    } else if (q && q.includes("@")) {
        jid = q.replace(/[@\s]/g, '') + "@s.whatsapp.net"; // If manually typing a JID
    } else {
        await react("+🤔");
        return reply("*AP NE KISE BLOCK KARNA CHAHTE HAI PEHLE USE MENTION KARO ☺️*");
    }

    try {
        await conn.updateBlockStatus(jid, "block");
        await react("😡");
        reply(`MENE APKO BLOCK KAR DYA @${jid.split("@")[0]}`, { mentions: [jid] });
    } catch (error) {
        console.error("ERROR", error);
        await react("🥺");
        reply("*AP THORI DER ME BLOCK HO JAYE GE*");
    }
});

cmd({
    pattern: "unblock",
    desc: "Unblocks a person",
    category: "owner",
    react: "😃",
    filename: __filename
},
async (conn, m, { reply, q, react }) => {
    // Get the bot owner's number dynamically
    const botOwner = conn.user.id.split(":")[0] + "@s.whatsapp.net";

    if (m.sender !== botOwner) {
        await react("🙋🏻");
        return reply("*YEH COMMAND SIRF MERE LIE HAI ☺️🌹*");
    }

    let jid;
    if (m.quoted) {
        jid = m.quoted.sender;
    } else if (m.mentionedJid.length > 0) {
        jid = m.mentionedJid[0];
    } else if (q && q.includes("@")) {
        jid = q.replace(/[@\s]/g, '') + "@s.whatsapp.net";
    } else {
        await react("❌");
        return reply("*AP NE KISE UNBLOCK KARNA CHAHTE HAI PEHLE USE MENTION KARO ☺️*");
    }

    try {
        await conn.updateBlockStatus(jid, "unblock");
        await react("☺️");
        reply(`MENE APKO UNBLOCK KAR DIA @${jid.split("@")[0]}`, { mentions: [jid] });
    } catch (error) {
        console.error("ERROR", error);
        await react("😊");
        reply("*AP THORI DER ME UNBLOCK HO JAYE GE ☺️🌹*");
    }
});           
