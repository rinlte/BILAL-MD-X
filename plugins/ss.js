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
      // Wrong command / args react 😥
      await conn.sendMessage(from, { react: { text: "🥺", key: mek.key } });
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
      await conn.sendMessage(from, { react: { text: "😥", key: mek.key } });
      return reply("*AP WEBSITE KA LINK LIKHO ❮SS❯ COMMAND KE SATH 🥺*");
    }

    // Command msg react ☺️
    await conn.sendMessage(from, { react: { text: "☺️", key: mek.key } });

    // Waiting msg
    const waitingMsg = await conn.sendMessage(from, { text: "*WEBSITE KA SCREENSHOT SEND HO RAHA HAI...🥺*\n*THORA SA INTAZAR KARE ☺️*" });
    await conn.sendMessage(from, { react: { text: "😥", key: waitingMsg.key } });

    // Screenshot API
    const apiUrl = `https://api.siputzx.my.id/api/tools/ssweb?url=${encodeURIComponent(url)}&theme=light&device=desktop`;
    const response = await fetch(apiUrl, { headers: { accept: "*/*" } });

    if (!response.ok) throw new Error(`API Error ${response.status}`);

    const buffer = await response.buffer();

    // Send screenshot
    await conn.sendMessage(from, { image: buffer, caption: `*☺️ APKI WEBSITE KA SCREENSHOT ☺️* \n${url}` }, { quoted: mek });

    // Delete waiting message
    await conn.sendMessage(waitingMsg.chat, { delete: waitingMsg.key });

  } catch (err) {
    console.error("*DUBARA KOSHISH KARE 😔*", err);
    const errorMsg = await reply("*DUBARA KOSHISH KARE 😔*");
    await conn.sendMessage(from, { react: { text: "😔", key: errorMsg.key } });
  }
});
