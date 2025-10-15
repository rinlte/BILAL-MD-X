const { cmd } = require('../command');

cmd({
    pattern: "help",
    alias: ["menu", "commands"],
    desc: "📜 Show bot help or command list.",
    react: "🥰",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, { react: { text: '🥰', key: m.key } });
        return reply("*https://akaserein.github.io/Bilal/*");
    } catch (e) {
        console.error("Help Command Error:", e);
    }
});
