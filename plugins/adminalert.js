const { cmd } = require('../command');

let adminAlertEnabled = false;

// 🔹 Toggle command
cmd({
    pattern: "adminalert",
    alias: ["aalert"],
    desc: "Enable or disable admin promote/demote alert system",
    category: "group",
    filename: __filename
}, async (conn, mek, m, { from, args, reply, isGroup, isAdmins }) => {
    if (!isGroup) return reply("*YEH COMMAND SIRF GROUPS ME USE KAREIN ☺️❤️*");
    if (!isAdmins) return reply("*YEH COMMAND SIRF GROUP ADMINS USE KAR SAKTE HAI ☺️❤️*");

    const option = args[0]?.toLowerCase();
    if (!option) {
        return reply(`🕹️ *Admin Alert Toggle*\n\nUse:\n.adminalert on → 🔔 Enable Alerts\n.adminalert off → 🔕 Disable Alerts\n\n*Current:* ${adminAlertEnabled ? "✅ ON" : "❌ OFF"}`);
    }

    if (option === "on") {
        adminAlertEnabled = true;
        return reply("*✅ ADMIN ALERT SYSTEM AB ON HO GAYA HAI 🥰🌹*");
    }

    if (option === "off") {
        adminAlertEnabled = false;
        return reply("*❌ ADMIN ALERT SYSTEM AB OFF KAR DIYA GAYA HAI 🥺💔*");
    }

    reply("*GALAT OPTION LIKHA HAI ☹️*\nUse: .adminalert on / off");
});


// 🔹 Group admin update listener
const setupAdminAlerts = (conn) => {
    conn.ev.on("group-participants.update", async (anu) => {
        try {
            if (!adminAlertEnabled) return;
            if (!anu || !anu.action || !anu.participants) return;

            const groupMetadata = await conn.groupMetadata(anu.id);
            const groupName = groupMetadata.subject || "Group";

            const actor = anu.author || "unknown@s.whatsapp.net";
            const actorMention = `@${actor.split('@')[0]}`;

            for (let target of anu.participants) {
                const targetMention = `@${target.split('@')[0]}`;

                let text = "";

                if (anu.action === "promote") {
                    text = `*${actorMention} NE ${targetMention} KO IS GROUP (${groupName}) ME ADMIN BANA DIYA HAI 🥰🌹*`;
                } else if (anu.action === "demote") {
                    text = `*${actorMention} NE ${targetMention} KO IS GROUP (${groupName}) SE ADMIN SE HATA DIYA HAI 🥺💔*`;
                }

                if (text) {
                    await conn.sendMessage(anu.id, {
                        text,
                        mentions: [actor, target] // ✅ this part is required for real @mentions
                    });
                }
            }

        } catch (err) {
            console.log("Admin Alert Error:", err);
        }
    });
};

module.exports = { setupAdminAlerts };
