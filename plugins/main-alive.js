if (global.aliveCommandLoaded) return;
global.aliveCommandLoaded = true;

const { cmd } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');
const config = require('../config');

cmd({
  pattern: "alive",
  alias: ["status", "online", "a", "active"],
  desc: "Check bot is alive or not",
  category: "main",
  react: "🥰",
  filename: __filename
}, async (conn, mek, m, { from, sender, reply }) => {
  try {
    const status = `*ASSALAMUALAIKUM ☺️* \n *KESE HAI AP 🥰* \n *UMEED HAI KE AP SAB KHARIYAT SE HOGE AUR BEHTAR BHI HOGE😇* \n *ALLAH AP SAB KO HAMESHA KHUSH RAKHE AMEEN 🤲💓*`;
    await conn.sendMessage(from, { text: status });
  } catch (e) {
    console.error("*GGG.....🥺💓*", e);
  }
});
