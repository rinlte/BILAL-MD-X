const { cmd } = require('../command');

cmd({
    pattern: "block",
    desc: "Block the current chat user (only in inbox)",
    category: "owner",
    react: "😈",
    filename: __filename
},
async (conn, m, { reply, react }) => {
    const botOwner = conn.user.id.split(":")[0] + "@s.whatsapp.net";

    // Only bot owner can use
    if (m.sender !== botOwner) {
        await react("🙋🏻");
        return reply("*YE COMMAND SIRF MERE LIE HAI OK ☺️🌹*");
    }

    // Only works in private chat
    if (!m.chat.endsWith("@s.whatsapp.net")) {
        await react("🤔");
        return reply("*YE COMMAND SIRF INBOX CHAT ME CHALE GI ☺️*");
    }

    try {
        await conn.updateBlockStatus(m.chat, "block");
        await react("😡");
        reply(`*MENE APKO BLOCK KAR DIYA @${m.chat.split("@")[0]}*`, { mentions: [m.chat] });
    } catch (err) {
        console.error("BLOCK ERROR:", err);
        await react("🥺");
        reply("*BLOCK KARTE HUE ERROR AYA 😔*");
    }
});


cmd({
    pattern: "unblock",
    desc: "Unblock the current chat user (only in inbox)",
    category: "owner",
    react: "😃",
    filename: __filename
},
async (conn, m, { reply, react }) => {
    const botOwner = conn.user.id.split(":")[0] + "@s.whatsapp.net";

    if (m.sender !== botOwner) {
        await react("🙋🏻");
        return reply("*YE COMMAND SIRF MERE LIE HAI OK ☺️🌹*");
    }

    if (!m.chat.endsWith("@s.whatsapp.net")) {
        await react("🤔");
        return reply("*YE COMMAND SIRF INBOX CHAT ME CHALE GI ☺️*");
    }

    try {
        await conn.updateBlockStatus(m.chat, "unblock");
        await react("☺️");
        reply(`*MENE APKO UNBLOCK KAR DIYA @${m.chat.split("@")[0]}*`, { mentions: [m.chat] });
    } catch (err) {
        console.error("UNBLOCK ERROR:", err);
        await react("🥺");
        reply("*UNBLOCK KARTE HUE ERROR AYA 😔*");
    }
});
