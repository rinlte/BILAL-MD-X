const { cmd } = require("../command");

const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);

cmd({
  pattern: "readmore",
  desc: "Split text into two parts using | and add ReadMore effect",
  category: "tools",
  use: "<text1>|<text2>",
}, async (m, conn, text) => {
  let [l, r] = text.split("|");
  if (!l) l = "";
  if (!r) r = "";
  
  await conn.sendMessage(
    m.chat,
    { text: l + readMore + r },
    { quoted: m }
  );
});
