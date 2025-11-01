const { cmd } = require('../command');
const config = require("../config");

cmd({
  'on': "body"
}, async (conn, m, store, {
  from,
  body,
  sender,
  isGroup,
  isAdmins,
  isBotAdmins,
  reply
}) => {
  try {
    if (!global.warnings) {
      global.warnings = {};
    }

    if (!isGroup || isAdmins || !isBotAdmins) {
      return;
    }

    if (config.ANTI_LINK !== 'true') {
      return;
    }

    const linkPatterns = [
      /https?:\/\/chat\.whatsapp\.com\/\S+/gi,
      /https?:\/\/api\.whatsapp\.com\/\S+/gi,
      /(?:https?:\/\/)?wa\.me\/\S+/gi,
      /(?:https?:\/\/)?t\.me\/\S+/gi,
      /(?:https?:\/\/)?telegram\.me\/\S+/gi,
      /https?:\/\/(?:www\.)?[a-zA-Z0-9-]+\.com\/\S+/gi,
      /https?:\/\/(?:www\.)?twitter\.com\/\S+/gi,
      /https?:\/\/(?:www\.)?x\.com\/\S+/gi,
      /https?:\/\/(?:www\.)?linkedin\.com\/\S+/gi,
      /https?:\/\/channel\.whatsapp\.com\/\S+/gi,
      /https?:\/\/(?:www\.)?reddit\.com\/\S+/gi,
      /https?:\/\/(?:www\.)?discord(?:app)?\.com\/\S+/gi,
      /https?:\/\/(?:www\.)?twitch\.tv\/\S+/gi,
      /https?:\/\/(?:www\.)?vimeo\.com\/\S+/gi,
      /https?:\/\/(?:www\.)?dailymotion\.com\/\S+/gi,
      /https?:\/\/(?:www\.)?medium\.com\/\S+/gi
    ];

    if (!body || typeof body !== 'string') {
      return;
    }

    const containsLink = linkPatterns.some(pattern => pattern.test(body));

    if (!containsLink) {
      return;
    }

    console.log(`🔗 Link detected from ${sender}: ${body.substring(0, 50)}...`);

    try {
      await conn.sendMessage(from, {
        delete: m.key
      });
      console.log(`✅ Message deleted: ${m.key.id}`);
    } catch (deleteError) {
      console.error("❌ Failed to delete message:", deleteError.message);
    }

    global.warnings[sender] = (global.warnings[sender] || 0) + 1;
    const warningCount = global.warnings[sender];

    console.log(`⚠️ User ${sender} now has ${warningCount} warning(s)`);

    if (warningCount < 4) {
      await conn.sendMessage(from, {
        text: `*⚠️ LINKS ARE NOT ALLOWED ⚠️*\n\n` +
              `*╭────⬡ WARNING ⬡────*\n` +
              `*├▢ USER:* @${sender.split('@')[0]}\n` +
              `*├▢ WARNING: ${warningCount}/3*\n` +
              `*├▢ REASON: Link Detected*\n` +
              `*├▢ ACTION: Message Deleted*\n` +
              `*╰────────────────*\n\n` +
              `_Next violation will result in removal!_`,
        mentions: [sender]
      });
    } else {
      await conn.sendMessage(from, {
        text: `*🚫 REMOVAL NOTICE 🚫*\n\n` +
              `@${sender.split('@')[0]} has been removed for exceeding the warning limit (${warningCount}/3).\n\n` +
              `_Reason: Multiple link violations_`,
        mentions: [sender]
      });
      
      try {
        await conn.groupParticipantsUpdate(from, [sender], "remove");
        console.log(`✅ User ${sender} removed from group`);
        delete global.warnings[sender];
      } catch (removeError) {
        console.error("❌ Failed to remove user:", removeError.message);
        reply("❌ Failed to remove user. Check bot permissions.");
      }
    }
  } catch (error) {
    console.error("❌ Anti-link error:", error);
    console.error("Stack trace:", error.stack);
  }
});
