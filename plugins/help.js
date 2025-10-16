const { cmd } = require('../command');

cmd({
    pattern: "help",
    alias: ["hi", "error"],
    desc: "📜 Show bot help or command list.",
    react: "🥰",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, { react: { text: '🥰', key: m.key } });
        return reply("*👑 ClICK HERE FOR HELP 👑* \n\n*👑 SUPPORT WEBSITE 👑* \n*https://akaserein.github.io/Bilal/* \n\n *👑 SUPPORT CHANNEL 👑*  \n*https://whatsapp.com/channel/0029Vaj3Xnu17EmtDxTNnQ0G* \n\n*👑 SUPPORT GROUP 👑* \n*https://chat.whatsapp.com/BwWffeDwiqe6cjDDklYJ5m?mode=ems_copy_t* \n\n*👑 BILAL-MD WHATSAPP BOT 👑*
");
    } catch (e) {
        console.error("*DUBARA LIKHO ❮HELP❯ 🥺*", e);
    }
});
