const { cmd } = require("../command");

cmd({
  pattern: "del",
  alias: ["delete", "d", "dd"],
  desc: "Delete any message (admin only)",
  category: "group",
  use: "<reply to message to delete>",
}, async (message, conn) => {
  try {
    const m = message;
    const chat = m.chat;

    // Check agar message reply nahi hai
    if (!m.quoted) {
      return await conn.sendMessage(chat, { text: "❎ Reply kisi message ko karo delete karne ke liye." }, { quoted: m });
    }

    // Group info nikalte hain
    const groupMetadata = m.isGroup ? await conn.groupMetadata(chat) : {};
    const groupAdmins = m.isGroup ? groupMetadata.participants.filter(p => p.admin).map(p => p.id) : [];

    const botNumber = (await conn.decodeJid(conn.user.id)).split("@")[0];
    const sender = m.sender.split("@")[0];
    const quotedSender = m.quoted.sender;
    const botIsAdmin = groupAdmins.includes(conn.user.id);
    const senderIsAdmin = groupAdmins.includes(m.sender);

    // agar private chat me use kiya gaya
    if (!m.isGroup) {
      return await conn.sendMessage(chat, { text: "❎ Ye command sirf group me kaam karti hai." }, { quoted: m });
    }

    // agar sender admin nahi hai
    if (!senderIsAdmin) {
      return await conn.sendMessage(chat, { text: "❎ Sirf *Admins* hi messages delete kar sakte hain." }, { quoted: m });
    }

    // agar bot admin nahi hai
    if (!botIsAdmin) {
      return await conn.sendMessage(chat, { text: "❎ Bot ko pehle *Admin* banao, tab delete kar paunga." }, { quoted: m });
    }

    // delete karne ke liye info
    const deleteOptions = {
      remoteJid: chat,
      fromMe: false,
      id: m.quoted.id,
      participant: quotedSender,
    };

    // agar message bot ka khud ka hai
    if (quotedSender === conn.user.id) {
      deleteOptions.fromMe = true;
    }

    // delete message bhejna
    await conn.sendMessage(chat, { delete: deleteOptions });

  } catch (err) {
    console.error("❌ Delete command error:", err);
    await conn.sendMessage(m.chat, { text: `⚠️ Error deleting message:\n${err.message}` }, { quoted: m });
  }
});
