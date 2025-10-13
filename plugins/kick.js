// kick.js
const { cmd } = require('../command');

cmd({
  pattern: 'kick',
  desc: 'Kick a user by replying to their message with .kick',
  category: 'group',
  react: '✅',
  filename: __filename,
}, async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, quoted, senderNumber, botNumber }) => {
  try {
    if (!isGroup) return conn.sendMessage(from, { text: '❌ This command can only be used in groups.' }, { quoted: mek });
    if (!isAdmins) return conn.sendMessage(from, { text: '❌ Only group admins can use this command.' }, { quoted: mek });
    if (!isBotAdmins) return conn.sendMessage(from, { text: '❌ I need to be admin to kick someone.' }, { quoted: mek });
    if (!quoted) return conn.sendMessage(from, { text: '❌ Please reply to the user you want to kick.' }, { quoted: mek });

    const userToKick = quoted.sender;
    if (userToKick === botNumber) return conn.sendMessage(from, { text: '❌ I cannot kick myself!' }, { quoted: mek });

    await conn.groupParticipantsUpdate(from, [userToKick], 'remove');
    conn.sendMessage(from, { text: `✅ Successfully kicked @${userToKick.split('@')[0]} from the group.`, mentions: [userToKick] }, { quoted: mek });
  } catch (err) {
    console.error('Kick error:', err);
    conn.sendMessage(from, { text: `❌ Failed to kick user: ${err.message}` }, { quoted: mek });
  }
});
