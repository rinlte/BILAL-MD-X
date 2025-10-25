const { sleep } = require('../lib/functions');

module.exports = async (conn, m) => {
  try {
    if (!m.message) return;

    // Message text lowcase me
    const text =
      (m.message.conversation ||
        m.message.extendedTextMessage?.text ||
        "").toLowerCase().trim();

    if (!text) return;

    // Ye words pe check karega
    const greetings = [
      "hi",
      "hii",
      "hy",
      "hey",
      "hello",
      "salam",
      "aslam",
      "assalam",
      "assalamualaikum",
      "as-salamu",
      "as-salamu-alaikum",
      "السلام",
      "السلام عليكم",
      "سلام",
      "hai",
      "halo"
    ];

    // Agar message inme se kisi ko contain karta hai
    if (greetings.some(word => text.includes(word))) {
      await conn.sendMessage(m.key.remoteJid, {
        react: { text: "🤲", key: m.key }
      });

      // Ye message bhejega
      const lines = [
        "*ASSALAMUALAIKUM ☺️*",
        "\n*KESE HAI AP 😇*",
        "\n*UMEED HAI KE AP KHARIYAT SE HOGE AUR BEHTAR HOGE 🥰*",
        "\n*AUR APKE GHAR ME BHI SAB KHARIYAT SE HOGE 🥰*",
        "\n*DUWA KRE GE APKE LIE 🤲*",
        "\n*ALLAH AP SAB KO HAMESHA KHUSH RAKHE AMEEN 🤲*",
        "\n*ALLAH AP SAB KI MUSHKIL PARSHANIYA DOOR KARE AMEEN 🤲*",
        "\n*AP APNA BAHUT KHAYAL RAKHIA KARO 🥰*",
        "\n*AUR HAMESHA KHUSH RAHA KARO 🥰*",
        "\n*KABHI SAD MAT HOYE 🥺♥️*",
        "\n\n*👑 BILAL-MD WHATSAPP BOT 👑*"
      ];

      let currentText = "";
      const msg = await conn.sendMessage(m.key.remoteJid, { text: currentText }, { quoted: m });

      for (const line of lines) {
        currentText += line + "\n";
        await sleep(2000);
        await conn.relayMessage(m.key.remoteJid, {
          protocolMessage: {
            key: msg.key,
            type: 14,
            editedMessage: { conversation: currentText }
          }
        }, {});
      }
    }
  } catch (e) {
    console.error("Auto Greeting Error:", e);
  }
};
