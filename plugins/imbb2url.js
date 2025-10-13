const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "imbb2url",
    desc: "Convert image URL to imgBB public link",
    category: "tools",
    react: "🖼️",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        // React on command message 🥺
        await conn.sendMessage(from, { react: { text: "🥺", key: m.key } });

        if (!q) return reply("*AGAR AP IMAGE KO PUBLIC LINK ME CONVERT KARNA CHAHTE HO 🥺* \n *TO AP ESE LIKHO 😇*\n\n*.imbb2url <IMAGE URL>*");

        const waitMsg = await conn.sendMessage(from, { text: "*IMAGE UPLOAD HO RAHI HAI....☺️*" });

        const apiUrl = `https://delirius-apiofc.vercel.app/tools/ibb?image=${encodeURIComponent(q)}&filename=img`;

        const { data } = await axios.get(apiUrl);

        // Delete waiting message
        if (waitMsg) await conn.sendMessage(from, { delete: waitMsg.key });

        if (!data || !data.status) {
            await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
            return reply("*DUBARA KOSHISH KARE 🥺*");
        }

        // React on command message after success ☺️
        await conn.sendMessage(from, { react: { text: "☺️", key: m.key } });

        // Send the public link
        reply(`*IMAGE SUCCESSFULLY UPLOADED!* 🖼️\n\nPublic Link:\n${data.url}`);

    } catch (e) {
        console.error("imbb2url error:", e);
        await conn.sendMessage(from, { react: { text: "😔", key: m.key } });
        reply("*DUBARA KOSHISH KARE 🥺*");
    }
});
