const fetch = require("node-fetch");
const { cmd } = require("../command");

cmd({
  pattern: "ss",
  alias: ["ssweb", "screenshot"],
  desc: "Take a screenshot of any website",
  category: "tools",
  react: "🥺",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  try {
    if (!args[0]) {
      return reply(
        `*AP KO KISI WEBSITE KA SCREENSHOT CHAHYE 🥺*\n\n` +
        `*TO AP US WEBSITE KA LINK COPY KAR LO* \n*PHIR ESE LIKHO ☺️*\n\n*SS ❮APKI WEBSITE KA LINK❯*\n\n` +
        `*JAB AP ESE LIKHO GE 🥺 TO US WEBSITE KA SCREENSHOT ☺️ YAHA PER SEND KAR DIA JAYE GA 🌹*\n\n` +
        `*👑 BILAL-MD WHATSAPP BOT 👑*`
      );
    }

    const url = args[0].trim();

    // URL validation
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return reply("*AP WEBSITE KA LINK LIKHO ❮SS❯ COMMAND KE SATH ☺️*");
    }

    await conn.sendMessage(from, { react: { text: "☺️", key: mek.key } });

    // Screenshot API
    const apiUrl = `https://api.siputzx.my.id/api/tools/ssweb?url=${encodeURIComponent(url)}&theme=light&device=desktop`;
    const response = await fetch(apiUrl, { headers: { accept: "*/*" } });

    if (!response.ok) throw new Error(`API Error ${response.status}`);

    const buffer = await response.buffer();

    await conn.sendMessage(from, { image: buffer, caption: `*APKI WEBSITE KA SCREENSHOT ☺️* \n${url}` }, { quoted: mek });

  } catch (err) {
    console.error("❌ SS Command Error:", err);
    reply(
      "❌ Failed to take screenshot. Possible reasons:\n" +
      "• Invalid URL\n" +
      "• Website blocking screenshot\n" +
      "• Website down\n" +
      "• API unavailable"
    );
  }
});
