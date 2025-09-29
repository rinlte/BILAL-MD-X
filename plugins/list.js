const { cmd } = require('../command'); // 👈 yeh line add ki

cmd({
  pattern: "list",
  desc: "Show all available commands",
  category: "main"
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const pluginsFolder = './plugins';
    let commands = [];

    fs.readdirSync(pluginsFolder).forEach(file => {
      const filePath = path.join(pluginsFolder, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const regex = /cmd\({ pattern: "([^"]+)"/g;
      let match;
      while ((match = regex.exec(fileContent)) !== null) {
        commands.push(match[1]);
      }
    });

    const message = `📋 Available Commands:\n\n${commands.join('\n')}`;
    conn.sendMessage(from, { text: message });
  } catch (e) {
    console.log(e);
    reply(`${e}`);
  }
});
