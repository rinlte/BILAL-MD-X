const { cmd } = require("../command");
const fetch = require("node-fetch");

cmd({
  pattern: 'gitclone',
  alias: ["git"],
  desc: "Download GitHub repository as a zip file.",
  react: '🥺',
  category: "downloader",
  filename: __filename
}, async (conn, m, store, { from, quoted, args, reply }) => {

  // 🟢 Agar koi sirf '.gitclone' likhe (without link)
  if (!args[0]) {
    await conn.sendMessage(from, { react: { text: "🤔", key: m.key } });
    return reply(`*AGAR AP NE KISI GITHUB REPO KI ZIP FILE DOWNLOAD KARNI HAI 🥺*
    *TO AP ESE LIKHO ☺️*
    
    *.GITCLONE ❮GITHUB REPO LINK❯*
    
   *JAB AP ESE LIKHO GE 😇 TO US REPO KI ZIP FILE DOWNLOAD KAR KE YAHA BHEJ DE JAYE GE 🥰❤️*`);
  }

  // 🟡 Invalid link check
  if (!/^(https:\/\/)?github\.com\/.+/.test(args[0])) {
    await conn.sendMessage(from, { react: { text: "⚠️", key: m.key } });
    return reply(`❌ *SIRF GITHUB REPO LINK DO 🥺*

👉 Example:
https://github.com/BiLaLTeCh05/BILAL-MD

> *Kisi aur website ka link mat do ☺️*`);
  }

  try {
    const regex = /github\.com\/([^\/]+)\/([^\/]+)(?:\.git)?/i;
    const match = args[0].match(regex);

    if (!match) {
      await conn.sendMessage(from, { react: { text: "😢", key: m.key } });
      throw new Error("❌ Invalid GitHub link!");
    }

    const [, username, repo] = match;
    const zipUrl = `https://api.github.com/repos/${username}/${repo}/zipball`;

    // 🔍 Check if repository exists
    const response = await fetch(zipUrl, { method: "HEAD" });
    if (!response.ok) {
      await conn.sendMessage(from, { react: { text: "🔒", key: m.key } });
      throw new Error("YEH PRIVATE REPO KA LINK HAI 🥺 AP SIRF PUBLIC REPO KA LINK DO ☺️");
    }

    const contentDisposition = response.headers.get("content-disposition");
    const fileName = contentDisposition
      ? contentDisposition.match(/filename=(.*)/)[1]
      : `${repo}.zip`;

    // 🟢 Untouched message + reaction
    await conn.sendMessage(from, { react: { text: "😃", key: m.key } });
    const downloadingMsg = await reply(`*APKI REPO KI ZIP FILE DOWNLOAD HO RAHI HAI 😃*`);

    // 📨 Send the ZIP file
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

    // 🧹 Instantly delete the "downloading" message
    try {
      await conn.sendMessage(from, { delete: downloadingMsg.key });
    } catch (e) {
      console.log("⚠️ Failed to delete message:", e);
    }

    await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error(error);
    await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
    reply(`❌ *DUBARA KOSHISH KARO 🥺*

_Maybe link invalid ya repo private hai ☹️_`);
  }
});
