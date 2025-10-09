const { cmd, commands } = require("../command");
const moment = require("moment-timezone");
const os = require("os");
const { fancytext, formatp, runtime, botpic, tiny, tlang } = require("../lib");
const config = require("../config");

// 🧠 Help/Menu Command
cmd({
  pattern: "help",
  alias: ["menu"],
  desc: "Show help list or command details.",
  category: "general",
  react: "🧑‍💻",
  filename: __filename
}, async (client, message, args, { reply }) => {

  try {
    if (args && args[0]) {
      const name = args[0].toLowerCase();
      const cmdInfo = commands.find(c => c.pattern === name);
      if (!cmdInfo) return reply("*😔 No such command found.*");

      let info = `*🍁 Command:* ${cmdInfo.pattern}`;
      if (cmdInfo.category) info += `\n*✨ Category:* ${cmdInfo.category}`;
      if (cmdInfo.alias) info += `\n*⚡️ Alias:* ${cmdInfo.alias}`;
      if (cmdInfo.desc) info += `\n*🗂 Description:* ${cmdInfo.desc}`;
      if (cmdInfo.use) info += `\n*📡 Usage:*\n\`\`\`${config.prefix}${cmdInfo.pattern} ${cmdInfo.use}\`\`\``;

      return reply(info);
    }

    // 🧾 Build category-wise command list
    const categorized = {};
    for (const cmd of commands) {
      if (cmd.dontAddCommandList === false && cmd.pattern) {
        if (!categorized[cmd.category]) categorized[cmd.category] = [];
        categorized[cmd.category].push(cmd.pattern);
      }
    }

    const time = moment().tz("Africa/Lagos").format("HH:mm:ss");
    const date = moment().tz("Africa/Lagos").format("DD/MM/YYYY");
    const uptime = runtime(process.uptime());
    const totalMem = formatp(os.totalmem());
    const freeMem = formatp(os.totalmem() - os.freemem());

    let menu = `┏┘ ⊆ ${fancytext(config.ownername.split(' ')[0], 38)} ⊇ └┓\n`;
    menu += '```' + `\n ─⦁⇆ㅤ || ◁ㅤ ❚❚ ㅤ▷ ||ㅤ ↻⦁─\n
👤 User: ${message.pushName}
🖼️ Theme: ${tlang().title}
📌 Prefix: [ ${config.prefix} ]
👑 Owner: ${config.ownername}
📍 Commands: ${commands.length}
🕐 Uptime: ${uptime}
💾 Memory: ${freeMem}/${totalMem}
🕐 Time: ${time}
🗓️ Date: ${date}
⦁─😈 BILAL-MD 😈─⦁
` + '```';

    for (const category in categorized) {
      menu += `\n╭. ❃ *${tiny(category)}* ❃ ╮\n`;
      for (const name of categorized[category]) {
        menu += `⚙️➣ ${fancytext(name, 1)}\n`;
      }
      menu += `╰──────────────╯\n`;
    }

    menu += `\n*💡 TIP:* Type _${config.prefix}help <command>_ to get detailed info.\n*Example:* _${config.prefix}help sticker_`;

    const imageUrl = await botpic();
    await client.sendMessage(message.chat, {
      image: { url: imageUrl },
      caption: menu
    });

  } catch (err) {
    console.error("Help Command Error:", err);
    reply("*❌ Menu generation failed — check logs.*");
  }

});
