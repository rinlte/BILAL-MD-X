const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "fancy",
  alias: ["font", "style"],
  react: "✍️",
  desc: "Convert text into various fancy fonts.",
  category: "tools",
  filename: __filename
}, async (conn, m, store, { from, quoted, args, q, reply }) => {
  try {
    if (!q) {
      return reply("*APKO APKE NAME KA FANCY TEXT BANANA HAI ☺️♥️* \n *TO AP ESE LIKHO 🥰🌹\n *FANCY BILAL-MD* \n *JAB ESE LIKHE GE TO APKA NAMES FANCY TEXT ME SHOW HOGE ☺️♥️*");
    }

    const apiUrl = `https://www.dark-yasiya-api.site/other/font?text=${encodeURIComponent(q)}`;
    const response = await axios.get(apiUrl);

    if (!response.data.status || !response.data.result) {
      return reply("❌ Error fetching fonts. Please try again later.");
    }

    // ✅ Sirf font text show karega (name nahi)
    const fonts = response.data.result.map(item => item.result).join("\n\n");

    const resultText = `*APKE NAME KE FANCY TEXT YEH HAI ☺️♥️*\n\n${fonts}\n\n *👑 BILAL-MD WHATSAPP BOT 👑*`;

    await conn.sendMessage(from, { text: resultText }, { quoted: m });

  } catch (error) {
    console.error("*DUBARA KOSHISH KARE 🥺💓*", error.message);
    reply("*DUBARA KOSHISH KARE 🥺💓*");
  }
});
