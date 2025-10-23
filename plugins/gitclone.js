const { cmd } = require("../command");
const fetch = require("node-fetch");

cmd({
  pattern: 'gitclone',
  alias: ["git"],
  desc: "Download GitHub repository as a zip file.",
  react: '🥺',
  category: "downloader",
  filename: __filename
}, async (conn, m, store, {
  from,
  quoted,
  args,
  reply
}) => {
  if (!args[0]) {
    return reply("AP KO KISI GITHUB REPO KI ZIP FILE CHAHYE 🥺*\n*TO AP ESE LIKHO ☺️* \n\n *.GITCLONE ❮GITHUB REPO LINK❯* \n\n *JAB AP ESE LIKHO GE TO US REPO KI ZIP FILE DOWNLOAD KAR KE YAHA PER BHEJ DE JAYE GE 🥰🌹*");
  }

  if (!/^(https:\/\/)?github\.com\/.+/.test(args[0])) {
    return reply("SIRF GITHUB REPO KA LINK DO BAS 🥺 KISI AUR WEBSITE KA LINK NAI ☺️*");
  }

  try {
    const regex = /github\.com\/([^\/]+)\/([^\/]+)(?:\.git)?/i;
    const match = args[0].match(regex);

    if (!match) {
      throw new Error("*DUBARA KOSHISH KARO 🥺*");
    }

    const [, username, repo] = match;
    const zipUrl = `https://api.github.com/repos/${username}/${repo}/zipball`;

    // Check if repository exists
    const response = await fetch(zipUrl, { method: "HEAD" });
    if (!response.ok) {
      throw new Error("*YEH PRIVATE REPO KA LINK HAI 🥺 AP SIRF PUBLIC REPO KA LINK DO ☺️*");
    }

    const contentDisposition = response.headers.get("content-disposition");
    const fileName = contentDisposition ? contentDisposition.match(/filename=(.*)/)[1] : `${repo}.zip`;

    // Notify user of the download
    reply(`*ZIP FILE DOWNLOAD HO RAHI HAI ☺️*\n\n*Repository:* ${username}/${repo}\n*Filename:* ${fileName}\n\n> *Powered by 『BILAL-MD』*`);

    // Send the zip file to the user with custom contextInfo
    await conn.sendMessage(from, {
      document: { url: zipUrl },
      fileName: fileName,
      mimetype: 'application/zip',
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363296818107681@newsletter',
          newsletterName: '*👑 BILAL-MD WHATSAPP BOT 👑️*',
          serverMessageId: 143
        }
      }
    }, { quoted: m });

  } catch (error) {
    console.error("*DUBARA KOSHISH KARO 🥺*", error);
    reply("*DUBARA KOSHISH KARO 🥺*");
  }
});
