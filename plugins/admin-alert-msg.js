const { cmd } = require('../command');

cmd({
    pattern: "adminalert",
    alias: ["adminalert"],
    desc: "Always alert when admin promoted or demoted (always active)",
    category: "group",
    filename: __filename
}, async (conn) => {
    try {
        // 🔹 Permanent listener (always ON)
        conn.ev.on('group-participants.update', async (anu) => {
            try {
                if (!anu.participants || !anu.id) return;

                const metadata = await conn.groupMetadata(anu.id);
                const groupName = metadata.subject;

                // 🟢 Jab koi member ko admin banaye
                if (anu.action === 'promote') {
                    for (let num of anu.participants) {
                        const text = `*( ${anu.author?.split('@')[0]} ) NE IS MEMBER ( ${num.split('@')[0]} ) KO IS GROUP (${groupName}) ME ADMIN BANA DIYA HAI 🥰🌹*`;

                        await conn.sendMessage(anu.id, {
                            text,
                            mentions: [num, anu.author]
                        });
                    }
                }

                // 🔴 Jab kisi admin ko dismiss (demote) kare
                if (anu.action === 'demote') {
                    for (let num of anu.participants) {
                        const text = `*( ${anu.author?.split('@')[0]} ) NE IS ADMIN ( ${num.split('@')[0]} ) KO IS GROUP (${groupName}) SE ADMIN SE HATA DIYA HAI 🥺💔*`;

                        await conn.sendMessage(anu.id, {
                            text,
                            mentions: [num, anu.author]
                        });
                    }
                }

            } catch (err) {
                console.error("Admin Alert Error:", err);
            }
        });

    } catch (e) {
        console.error("Admin Alert Setup Error:", e);
    }
});
