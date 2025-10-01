/**
 * BILAL-MD • Heroku + Sudo Management Commands
 * Author: Umar Farooq
 */

const Config = require('../config');
const { prefix, smd } = require('../lib');

// ✅ Use global fetch (Node 18+). Fallback: node-fetch for Node <18
let fetchFn = global.fetch;
if (!fetchFn) {
  fetchFn = (...args) => import('node-fetch').then(({ default: f }) => f(...args));
}
const fetch = fetchFn;

// Heroku creds
const appName = Config.HEROKU_APP_NAME ? Config.HEROKU_APP_NAME.trim() : '';
const authToken = Config.HEROKU_API_KEY;
const HEROKU = !!(authToken && appName);

// Reload config after env changes
let updateConfig = () => {
  try {
    const configPath = '../config';
    delete require.cache[require.resolve(configPath)];
    require(configPath);
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

// -------------------------
// Heroku API Helpers
// -------------------------
const heroku = {};

heroku.addVar = async (key, value) => {
  try {
    const headers = {
      Accept: 'application/vnd.heroku+json; version=3',
      Authorization: 'Bearer ' + authToken,
      'Content-Type': 'application/json'
    };
    const url = `https://api.heroku.com/apps/${appName}/config-vars`;
    const res = await fetch(url, { method: 'PATCH', headers, body: JSON.stringify({ [key]: value }) });
    return { status: res.ok, data: await res.json() };
  } catch (err) {
    return { status: false, data: err.message };
  }
};

heroku.getAllVars = async () => {
  try {
    const headers = {
      Accept: 'application/vnd.heroku+json; version=3',
      Authorization: 'Bearer ' + authToken
    };
    const res = await fetch(`https://api.heroku.com/apps/${appName}/config-vars`, { headers });
    const data = await res.json();
    let out = `*${appName} VARS* \n*________________________________________*\n`;
    for (let k in data) out += `*${k}* : \`${data[k]}\`\n`;
    return { status: true, data: out };
  } catch (err) {
    return { status: false, data: err.message };
  }
};

heroku.getVar = async (key) => {
  try {
    const headers = {
      Accept: 'application/vnd.heroku+json; version=3',
      Authorization: 'Bearer ' + authToken
    };
    const res = await fetch(`https://api.heroku.com/apps/${appName}/config-vars`, { headers });
    const data = await res.json();
    return { status: true, data: data[key] };
  } catch (err) {
    return { status: false, data: err.message };
  }
};

heroku.setVarIfExists = async (key, value) => {
  try {
    const headers = {
      Accept: 'application/vnd.heroku+json; version=3',
      Authorization: 'Bearer ' + authToken,
      'Content-Type': 'application/json'
    };
    const res = await fetch(`https://api.heroku.com/apps/${appName}/config-vars`, { headers });
    const current = await res.json();
    if (!current.hasOwnProperty(key)) return { status: false, data: 'Variable not found in app' };
    const patchRes = await fetch(`https://api.heroku.com/apps/${appName}/config-vars`, {
      method: 'PATCH', headers, body: JSON.stringify({ [key]: value })
    });
    return { status: patchRes.ok, data: await patchRes.json() };
  } catch (err) {
    return { status: false, data: err.message };
  }
};

// -------------------------
// Commands
// -------------------------

// Sudo list
smd({
  cmdname: 'sudo',
  alias: ['mods'],
  info: 'Get sudo users list',
  fromMe: true,
  type: 'tools',
  filename: __filename
}, async (msg) => {
  let arr = (global.sudo || '').split(',').filter(x => x && x !== 'null');
  if (!arr.length) return msg.reply('*No sudo/mods added!*');
  let listText = arr.map((v, i) => ` ${i + 1}. ${v}`).join('\n');
  msg.reply(`*SUDO LIST*\n\n${listText}`);
});

// Add sudo
smd({
  pattern: 'setsudo',
  alias: ['addsudo'],
  fromMe: true,
  info: 'Add sudo user',
  type: 'tools',
  filename: __filename
}, async (msg) => {
  let jid = msg.reply_message ? msg.reply_message.sender : (msg.mentionedJid && msg.mentionedJid[0]);
  if (!jid) return msg.reply('Reply or mention a user!');
  if (!global.sudo?.includes(jid)) global.sudo = (global.sudo || '') + ',' + jid;
  let result = HEROKU ? await heroku.addVar('SUDO', global.sudo) : { status: false };
  msg.reply(result.status ? `✅ Added to sudo: ${jid}` : `Temporarily added (Heroku not updated)`);
});

// Delete sudo
smd({
  pattern: 'delsudo',
  alias: ['deletesudo'],
  fromMe: true,
  info: 'Remove sudo user',
  type: 'tools',
  filename: __filename
}, async (msg) => {
  let jid = msg.reply_message ? msg.reply_message.sender : (msg.mentionedJid && msg.mentionedJid[0]);
  if (!jid) return msg.reply('Reply or mention a user!');
  if (global.sudo?.includes(jid)) global.sudo = global.sudo.replace(',' + jid, '');
  else return msg.reply('User not in sudo list!');
  let result = HEROKU ? await heroku.addVar('SUDO', global.sudo) : { status: false };
  msg.reply(result.status ? `❌ Removed from sudo: ${jid}` : `Removed locally (Heroku not updated)`);
});

// All vars
smd({
  pattern: 'allvar',
  fromMe: true,
  info: 'Show all heroku vars',
  type: 'tools',
  filename: __filename
}, async (msg) => {
  let result = await heroku.getAllVars();
  msg.reply(result.status ? result.data : 'Heroku not responding. Check API key/app name.');
});

// Get var
smd({
  pattern: 'getvar',
  fromMe: true,
  info: 'Get single heroku var',
  type: 'tools',
  filename: __filename
}, async (msg, text) => {
  if (!text) return msg.reply(`Usage: ${prefix}getvar VAR_NAME`);
  let result = await heroku.getVar(text.toUpperCase());
  msg.reply(result.status ? `${text.toUpperCase()} = ${result.data || 'Not Found'}` : result.data);
});

// Set var
smd({
  pattern: 'setvar',
  fromMe: true,
  info: 'Set heroku var',
  type: 'tools',
  filename: __filename
}, async (msg, text) => {
  if (!text.includes(':')) return msg.reply(`Usage: ${prefix}setvar KEY:VALUE`);
  let [key, ...valArr] = text.split(':');
  let value = valArr.join(':').trim();
  key = key.toUpperCase().trim();
  process.env[key] = value;
  updateConfig();
  let result = await heroku.setVarIfExists(key, value);
  msg.reply(result.status ? `✅ ${key} updated to ${value}` : `❌ ${result.data}`);
});

module.exports = heroku;
