const { proto, downloadContentFromMessage, getContentType } = require('@whiskeysockets/baileys');
const fs = require('fs');

// =============================
// 📥 DOWNLOAD MEDIA FUNCTION
// =============================
const downloadMediaMessage = async (m, filename) => {
    if (m.type === 'viewOnceMessage') {
        m.type = m.msg.type;
    }
    if (m.type === 'imageMessage') {
        var nameJpg = filename ? filename + '.jpg' : 'undefined.jpg';
        const stream = await downloadContentFromMessage(m.msg, 'image');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
        fs.writeFileSync(nameJpg, buffer);
        return fs.readFileSync(nameJpg);
    } else if (m.type === 'videoMessage') {
        var nameMp4 = filename ? filename + '.mp4' : 'undefined.mp4';
        const stream = await downloadContentFromMessage(m.msg, 'video');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
        fs.writeFileSync(nameMp4, buffer);
        return fs.readFileSync(nameMp4);
    } else if (m.type === 'audioMessage') {
        var nameMp3 = filename ? filename + '.mp3' : 'undefined.mp3';
        const stream = await downloadContentFromMessage(m.msg, 'audio');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
        fs.writeFileSync(nameMp3, buffer);
        return fs.readFileSync(nameMp3);
    } else if (m.type === 'stickerMessage') {
        var nameWebp = filename ? filename + '.webp' : 'undefined.webp';
        const stream = await downloadContentFromMessage(m.msg, 'sticker');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
        fs.writeFileSync(nameWebp, buffer);
        return fs.readFileSync(nameWebp);
    } else if (m.type === 'documentMessage') {
        var ext = m.msg.fileName.split('.')[1].toLowerCase().replace('jpeg', 'jpg').replace('png', 'jpg').replace('m4a', 'mp3');
        var nameDoc = filename ? filename + '.' + ext : 'undefined.' + ext;
        const stream = await downloadContentFromMessage(m.msg, 'document');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);
        fs.writeFileSync(nameDoc, buffer);
        return fs.readFileSync(nameDoc);
    }
};

// =============================
// 💬 SMS HANDLER FUNCTION
// =============================
const sms = async (conn, m, store) => {
    if (!m) return m;
    let M = proto.WebMessageInfo;

    if (m.key) {
        m.id = m.key.id;
        m.isBot = m.id.startsWith('BAES') && m.id.length === 16;
        m.isBaileys = m.id.startsWith('BAE5') && m.id.length === 16;
        m.chat = m.key.remoteJid;
        m.fromMe = m.key.fromMe;
        m.isGroup = m.chat.endsWith('@g.us');
        m.sender = m.fromMe
            ? conn.user.id.split(':')[0] + '@s.whatsapp.net'
            : m.isGroup
            ? m.key.participant
            : m.key.remoteJid;
    }

    // ============================================
    // 🔥 AUTO RECORDING PRESENCE (8 seconds)
    // ============================================
    try {
        await conn.sendPresenceUpdate('recording', m.chat);
        setTimeout(async () => {
            await conn.sendPresenceUpdate('available', m.chat);
        }, 8000);
    } catch (err) {
        console.log('Auto recording error:', err);
    }

    if (m.message) {
        m.mtype = getContentType(m.message);
        m.msg = (m.mtype == 'viewOnceMessage')
            ? m.message[m.mtype].message[getContentType(m.message[m.mtype].message)]
            : m.message[m.mtype];

        try {
            m.body =
                (m.mtype === 'conversation') ? m.message.conversation :
                (m.mtype == 'imageMessage' && m.message.imageMessage.caption) ? m.message.imageMessage.caption :
                (m.mtype == 'videoMessage' && m.message.videoMessage.caption) ? m.message.videoMessage.caption :
                (m.mtype == 'extendedTextMessage' && m.message.extendedTextMessage.text) ? m.message.extendedTextMessage.text :
                (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId :
                (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
                (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId :
                (m.mtype === 'messageContextInfo')
                    ? (m.message.buttonsResponseMessage?.selectedButtonId ||
                       m.message.listResponseMessage?.singleSelectReply.selectedRowId ||
                       m.text)
                    : '';
        } catch {
            m.body = false;
        }
    }

    // Baaki poora tumhara handler ka normal kaam yahan chalega
    return m;
};

// =============================
// 📤 EXPORT MODULES
// =============================
module.exports = { sms, downloadMediaMessage };
