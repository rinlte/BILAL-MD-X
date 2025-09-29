const config = require('../config');
const { cmd, commands } = require('../command');

// ping2
cmd({
  pattern: "ping",
  desc: "Check bot's response time.",
  category: "main",
  react: "👑",
  filename: __filename
}, async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
  try {
    const startTime = Date.now()
    await conn.sendMessage(from, { text: '*Gg...☺️*' })
    const endTime = Date.now()
    console.log('Response time: ' + (endTime - startTime) + ' ms')
  } catch (e) {
    console.log(e)
    reply(`${e}`)
  }
})
