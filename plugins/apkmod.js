const axios = require("axios");

const apkpureApi = "https://apkpure.com/api/v2/search?q=";
const apkpureDownloadApi = "https://apkpure.com/api/v2/download?id=";
const deliriusApi = "https://delirius-apiofc.vercel.app/download/apk?query=";

const { cmd } = require("../command");

cmd({
  pattern: "apk",
  alias: ["apkmod", "modapk", "dapk2", "aptoide", "aptoidedl"],
  desc: "Download APKs from apkpure / delirius",
  category: "downloader",
  use: "<apk name>",
}, async (m, conn, text) => {
  if (!text) {
    return conn.sendMessage(m.chat, { text: "⚠️ *Please enter the APK name*" }, { quoted: m });
  }

  await conn.sendMessage(m.chat, { text: "⌛ Please wait, fetching APK..." }, { quoted: m });

  try {
    // -------- Primary API (Delirius) --------
    const res = await axios.get(deliriusApi + encodeURIComponent(text));
    const data = res.data.data;

    if (!res.data.status || !data) {
      return conn.sendMessage(m.chat, { text: "⚠️ Could not find the requested APK. Try another name." }, { quoted: m });
    }

    let caption = `≪DOWNLOADED APK🚀≫\n\n` +
      `┏━━━━━━━━━━━━━━━━━━━━━━•\n` +
      `┃💫 Name: ${data.name}\n` +
      `┃👤 Developer: ${data.developer}\n` +
      `┃🕒 Last Update: ${data.lastup}\n` +
      `┃📦 Size: ${data.size}\n` +
      `┗━━━━━━━━━━━━━━━━━━━━━━•\n\n` +
      `> ⏳ Please wait a moment while your APK is being sent...`;

    await conn.sendMessage(m.chat, { image: { url: data.icon }, caption }, { quoted: m });

    if (data.size.includes("GB") || parseFloat(data.size.replace(" MB", "")) > 300) {
      return conn.sendMessage(m.chat, { text: "*The APK is too large.*" }, { quoted: m });
    }

    await conn.sendMessage(m.chat, {
      document: { url: data.dllink },
      mimetype: "application/vnd.android.package-archive",
      fileName: data.name + ".apk"
    }, { quoted: m });

    return conn.sendMessage(m.chat, { text: "✅ Success" }, { quoted: m });

  } catch (err1) {
    try {
      // -------- Backup API (Apkpure) --------
      const searchRes = await axios.get(apkpureApi + encodeURIComponent(text));
      const first = searchRes.data.results[0];
      const downloadRes = await axios.get(apkpureDownloadApi + first.id);
      const data = downloadRes.data;

      let caption = `≪DOWNLOADED APK🚀≫\n\n` +
        `┏━━━━━━━━━━━━━━━━━━━━━━•\n` +
        `┃💫 Name: ${data.name}\n` +
        `┃👤 Developer: ${data.dev}\n` +
        `┃🕒 Last Update: ${data.lastup}\n` +
        `┃📦 Size: ${data.size}\n` +
        `┗━━━━━━━━━━━━━━━━━━━━━━•`;

      await conn.sendMessage(m.chat, { image: { url: data.icon }, caption }, { quoted: m });

      if (data.size.includes("GB") || parseFloat(data.size.replace(" MB", "")) > 300) {
        return conn.sendMessage(m.chat, { text: "*The APK is too large.*" }, { quoted: m });
      }

      await conn.sendMessage(m.chat, {
        document: { url: data.dllink },
        mimetype: "application/vnd.android.package-archive",
        fileName: data.name + ".apk"
      }, { quoted: m });

      return conn.sendMessage(m.chat, { text: "✅ Success" }, { quoted: m });

    } catch (err2) {
      console.error(err2);
      return conn.sendMessage(m.chat, { text: "❌ Error occurred while fetching APK." }, { quoted: m });
    }
  }
});
