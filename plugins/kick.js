if (!quoted) return conn.sendMessage(from, { text: '❌ Reply to the user you want to kick.' }, { quoted: mek });
const userToKick = quoted.sender;
if (!userToKick) return conn.sendMessage(from, { text: '❌ Invalid user.' }, { quoted: mek });
if (userToKick === botNumber) return conn.sendMessage(from, { text: '❌ Cannot kick myself!' }, { quoted: mek });

try {
    await conn.groupParticipantsUpdate(from, [userToKick], 'remove');
    conn.sendMessage(from, { text: `✅ Kicked @${userToKick.split('@')[0]}`, mentions: [userToKick] }, { quoted: mek });
} catch {
    await sleep(2000); // wait 2 sec
    await conn.groupParticipantsUpdate(from, [userToKick], 'remove');
    conn.sendMessage(from, { text: `✅ Kicked @${userToKick.split('@')[0]}`, mentions: [userToKick] }, { quoted: mek });
}
