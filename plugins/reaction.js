// boardReaction.js
import config from '../../config.cjs'; // your config with PREFIX and OWNER
import { proto } from '@whiskeysockets/baileys';

// Memory storage (temporary)
let reactionTrigger = {
  active: false,
  ownerJid: null,
  timeout: null,
};

// =============== 1. LISTEN TO OWNER REACTION ================
export const handleReactionTrigger = async (sock) => {
  sock.ev.on('messages.reaction', async (reactionUpdate) => {
    const { key, reaction } = reactionUpdate;
    const fromMe = key.fromMe;

    if (fromMe && reaction.text) {
      reactionTrigger.active = true;
      reactionTrigger.ownerJid = key.remoteJid;

      console.log(`🟢 Reaction trigger set by OWNER (${reactionTrigger.ownerJid})`);

      // Optional reset after 30 seconds
      if (reactionTrigger.timeout) clearTimeout(reactionTrigger.timeout);
      reactionTrigger.timeout = setTimeout(() => {
        reactionTrigger.active = false;
        reactionTrigger.ownerJid = null;
        console.log("🔴 Reaction trigger reset after timeout");
      }, 30000);
    }
  });
};

// =============== 2. MAIN BOT MESSAGE LISTENER ================
export const boardMessageSync = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body?.startsWith(prefix)
    ? m.body.slice(prefix.length).split(' ')[0].toLowerCase()
    : '';
  const text = m.body?.slice(prefix.length + cmd.length).trim();

  // Ignore owner messages
  if (m.key.fromMe) return;

  if (reactionTrigger.active && reactionTrigger.ownerJid) {
    const sender = m.sender || m.key.participant || m.key.remoteJid;

    // Send alert to owner
    await sock.sendMessage(reactionTrigger.ownerJid, {
      text: `🟡 *User @${sender.split('@')[0]}* used their board.\nTriggered by your reaction.`,
      mentions: [sender],
    });

    // React on user's message
    await sock.sendMessage(m.key.remoteJid, {
      react: {
        text: '❤️,
        key: m.key
      }
    });

    console.log(`↪️ Reacted to user: ${sender}`);
  }
};
