const { cmd } = require('../command');

cmd({
    pattern: "adminalert",
    alias: ["adminalert"],
    desc: "Always alerts when any admin is promoted or demoted manually or by bot",
    category: "group",
    filename: __filename
}, async (conn) => {
    try {
        // 🔹 Yeh listener hamesha ON rahega — chahe koi command run na bhi kare
        conn.ev.on('group-participants.update', async (anu) => {
            try {
                if (!anu.id || !anu.participants || !anu.action) return;

                // 🔹 Group info
                const metadata = await conn.groupMetadata(anu.id);
                const groupName = metadata.subject;

                // 🔹 Promote hua (kisi ko admin banaya gaya)
                if (anu.action === 'promote') {
                    for (let num of anu.participants) {
                        const text = `*( ${anu.author ? anu.author.split('@')[0] : 'Unknown Admin'} ) NE IS MEMBER ( ${num.split('@')[0]} ) KO IS GROUP (${groupName}) ME ADMIN BANA DIYA HAI 🥰🌹*`;

                        await conn.sendMessage(anu.id, {
                            text,
                            mentions: [anu.author, num]
                        });
                    }
                }

                // 🔹 Demote hua (kisi admin ko hataya gaya)
                if (anu.action === 'demote') {
                    for (let num of anu.participants) {
                        const text = `*( ${anu.author ? anu.author.split('@')[0] : 'Unknown Admin'} ) NE IS ADMIN ( ${num.split('@')[0]} ) KO IS GROUP (${groupName}) SE ADMIN SE HATA DIYA HAI 🥺💔*`;

                        await conn.sendMessage(anu.id, {
                            text,
                            mentions: [anu.author, num]
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
