const { cmd } = require('../command');


// 🔒 BLOCK COMMAND
cmd({
    pattern: "block",
    desc: "Block user (reply in group or direct in inbox)",
    category: "owner",
    react: "😈",
    filename: __filename
},
async (conn, m, { reply, react }) => {
    const botOwner = conn.user.id.split(":")[0] + "@s.whatsapp.net";

    // 🧠 Agar owner nahi hai
    if (m.sender !== botOwner) {
        await react("🙋🏻");
        return reply("*YEH COMMAND SIRF MERE LIE HAI ☺️*");
    }

    let jid;

    // ✅ Group reply
    if (m.quoted) {
        jid = m.quoted.sender;
    } 
    // ✅ Inbox me likha
    else if (m.chat.endsWith("@s.whatsapp.net")) {
        jid = m.chat;
    } 
    else {
        await react("🤔");
        return reply("*INBOX ME YA KISI KA MSG REPLY KARKE LIKHO 'block' ☺️*");
    }

    try {
        // 📨 Message before block
        await reply(`*AP MUJHE BAHUT TANG KAR RAHE HAI 🥺*\n\n*IS LIE MENE APKO BLOCK KAR DIYA ☺️💓*`);

        // 🔒 Block after delay
        setTimeout(async () => {
            await conn.updateBlockStatus(jid, "block");
            await react("😡");
        }, 1500);

    } catch (err) {
        console.error("BLOCK ERROR:", err);
        await react("🥺");
        reply("*BLOCK KARTE HUE ERROR AYA 😔*");
    }
});



// 🔓 UNBLOCK COMMAND
cmd({
    pattern: "unblock",
    desc: "Unblock user (reply in group or direct in inbox)",
    category: "owner",
    react: "😃",
    filename: __filename
},
async (conn, m, { reply, react }) => {
    const botOwner = conn.user.id.split(":")[0] + "@s.whatsapp.net";

    // 🧠 Agar owner nahi hai
    if (m.sender !== botOwner) {
        await react("🙋🏻");
        return reply("*YEH COMMAND SIRF MERE LIE HAI ☺️*");
    }

    let jid;

    // ✅ Group reply
    if (m.quoted) {
        jid = m.quoted.sender;
    } 
    // ✅ Inbox me likha
    else if (m.chat.endsWith("@s.whatsapp.net")) {
        jid = m.chat;
    } 
    else {
        await react("🤔");
        return reply("*INBOX ME YA KISI KA MSG REPLY KARKE LIKHO 'unblock' ☺️*");
    }

    try {
        // ✅ Pehle check karo banda blocked hai ya nahi
        const blockList = await conn.fetchBlocklist();

        if (blockList.includes(jid)) {
            await conn.updateBlockStatus(jid, "unblock");
            await react("😄");
            reply(`*MENE APKO UNBLOCK KAR DIYA @${jid.split("@")[0]} ☺️💓*`, { mentions: [jid] });
        } else {
            await react("🤔");
            reply(`*YE BANDA ABHI BLOCK NAHI HAI @${jid.split("@")[0]}*`, { mentions: [jid] });
        }

    } catch (err) {
        console.error("UNBLOCK ERROR:", err);
        await react("🥺");
        reply("*UNBLOCK KARTE HUE ERROR AYA 😔*");
    }
});
