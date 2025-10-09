const { DeletedText, DeletedMedia, AntiDelete } = require('./antidel');
// const { AntiViewOnce } = require('./antivv');
const { DATABASE } = require('./database');
const { 
  getBuffer, 
  getGroupAdmins, 
  getRandom, 
  h2k, 
  isUrl, 
  Json, 
  runtime, 
  sleep, 
  fetchJson 
} = require('./functions');
const { sms, downloadMediaMessage } = require('./msg');
// const { shannzCdn } = require('./shannzCdn');
const os = require("os");
const moment = require("moment-timezone");


// ================= Extra Functions (for menu/help/fancy texts) =================

function formatp(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

function fancytext(text, style = 1) {
  const fonts = {
    1: { a: '𝙖', b: '𝙗', c: '𝙘', d: '𝙙', e: '𝙚', f: '𝙛', g: '𝙜', h: '𝙝', i: '𝙞', j: '𝙟', k: '𝙠', l: '𝙡', m: '𝙢', n: '𝙣', o: '𝙤', p: '𝙥', q: '𝙦', r: '𝙧', s: '𝙨', t: '𝙩', u: '𝙪', v: '𝙫', w: '𝙬', x: '𝙭', y: '𝙮', z: '𝙯' },
    2: { a: '🅐', b: '🅑', c: '🅒', d: '🅓', e: '🅔', f: '🅕', g: '🅖', h: '🅗', i: '🅘', j: '🅙', k: '🅚', l: '🅛', m: '🅜', n: '🅝', o: '🅞', p: '🅟', q: '🅠', r: '🅡', s: '🅢', t: '🅣', u: '🅤', v: '🅥', w: '🅦', x: '🅧', y: '🅨', z: '🅩' }
  };
  const font = fonts[style] || fonts[1];
  return text.split('').map(ch => font[ch.toLowerCase()] || ch).join('');
}

function tiny(text) {
  const smallCaps = { a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ғ', g: 'ɢ', h: 'ʜ', i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ', s: 's', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ' };
  return text.split('').map(c => smallCaps[c.toLowerCase()] || c).join('');
}

async function botpic() {
  return "https://telegra.ph/file/3b7e6a11e89c1a987af5b.jpg"; // apni bot ki image daal de
}

function tlang() {
  return { title: "BILAL-MD" };
}

// ==============================================================================

module.exports = {
    DeletedText,
    DeletedMedia,
    AntiDelete,
    // AntiViewOnce,
    getBuffer,
    getGroupAdmins,
    getRandom,
    h2k,
    isUrl,
    Json,
    runtime,
    sleep,
    fetchJson,
    DATABASE,
    sms,
    downloadMediaMessage,
    // shannzCdn,

    // ✅ Extra exports for menu/help
    fancytext,
    tiny,
    formatp,
    botpic,
    tlang
};
