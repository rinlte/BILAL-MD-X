const axios = require("axios");
const { cmd } = require("../command");

const deliriusApi = "https://delirius-apiofc.vercel.app/download/apk?query=";
const apkpureApi = "https://apkpure.com/api/v2/search?q=";
const apkpureDownloadApi = "https://apkpure.com/api/v2/download?id=";

cmd({
  pattern: "modapk",
  alias: ["apkmod", "apk", "apkpure", "modapp"],
  desc: "Download mod or normal APKs from trusted sources",
  category: "downloader",
  use: "<app name>",
}, async (message, conn, text) => {
  if (!text) {
    return conn.sendMessage(message.chat, { text: "⚠️ *Bhai APK ka naam likh na!*" }, { quoted: message });
  }

  await conn.sendMessage(message.chat, { text: "⏳ *Ruk ja bhai, APK dhoondh raha hoon...*" }, { quoted: message });

  try {
    // -------- Primary API: Delirius --------
    const res = await axios.get(deliriusApi + encodeURIComponent(text));
    const data = res.data?.data;

    if (!res.data.status || !data) throw new Error("Delirius API failed");

    let caption = `≪ DOWNLOADED APK 🚀 ≫\n\n` +
      `💫 *Name:* ${data.name}\n` +
      `👤 *Developer:* ${data.developer}\n` +
      `🕒 *Last Update:* ${data.lastup}\n` +
      `📦 *Size:* ${data.size}\n\n` +
      `> ⏳ Sending APK, please wait...`;

    await conn.sendMessage(message.chat, { image: { url: data.icon }, caption }, { quoted: message });

    // Large file check
    if (data.size.includes("GB") || parseFloat(data.size.replace(" MB", "")) > 300) {
      return conn.sendMessage(message.chat, { text: "⚠️ *Yeh APK bohot bada hai, bhejna possible nahi!*" }, { quoted: message });
    }

    await conn.sendMessage(message.chat, {
      document: { url: data.dllink },
      mimetype: "application/vnd.android.package-archive",
      fileName: `${data.name}.apk`
    }, { quoted: message });

    return conn.sendMessage(message.chat, { text: "✅ *Download Complete!*" }, { quoted: message });

  } catch (err1) {
    console.error("Primary API failed:", err1.message);

    // -------- Backup API: APKPure --------
    try {
      const searchRes = await axios.get(apkpureApi + encodeURIComponent(text));
      const first = searchRes.data?.results?.[0];
      if (!first) throw new Error("No APK found on APKPure");

      const downloadRes = await axios.get(apkpureDownloadApi + first.id);
      const data = downloadRes.data;

      let caption = `≪ DOWNLOADED APK 🚀 ≫\n\n` +
        `💫 *Name:* ${data.name}\n` +
        `👤 *Developer:* ${data.dev}\n` +
        `🕒 *Last Update:* ${data.lastup}\n` +
        `📦 *Size:* ${data.size}\n`;

      await conn.sendMessage(message.chat, { image: { url: data.icon }, caption }, { quoted: message });

      if (data.size.includes("GB") || parseFloat(data.size.replace(" MB", "")) > 300) {
        return conn.sendMessage(message.chat, { text: "⚠️ *File bohot badi hai, download nahi ho sakti!*" }, { quoted: message });
      }

      await conn.sendMessage(message.chat, {
        document: { url: data.dllink },
        mimetype: "application/vnd.android.package-archive",
        fileName: `${data.name}.apk`
      }, { quoted: message });

      return conn.sendMessage(message.chat, { text: "✅ *Download Complete!*" }, { quoted: message });

    } catch (err2) {
      console.error("Backup API failed:", err2.message);
      return conn.sendMessage(message.chat, { text: "❌ *APK nahi mil saka bhai, koi aur naam try kar!*" }, { quoted: message });
    }
  }
});
