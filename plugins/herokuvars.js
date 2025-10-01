/**
 * Cleaned & readable version of your obfuscated Heroku config + sudo management module.
 * Expects:
 *  - ../config to export HEROKU_APP_NAME and HEROKU_API_KEY (optional)
 *  - ../lib to export helpers like smd, prefix, etc.
 *
 * Commands registered:
 *  - sudo (list sudo/mods)
 *  - setsudo / addsudo (add sudo by mention)
 *  - delsudo / deletesudo (remove sudo by mention)
 *  - allvar (show all heroku config vars)
 *  - getvar (get a single heroku var)
 *  - setvar (set a heroku var)
 *
 * Keep in mind: this module uses global.sudo (comma-separated string of @numbers),
 * and toggles Heroku values if HEROKU_API_KEY + HEROKU_APP_NAME are present.
 */

const Config = require('../config');
const {
  fancytext, tlang, tiny, runtime, formatp, botpic, prefix, sck1, smd
} = require('../lib');

const axios = require('axios');
const fetch = require('node-fetch'); // original used node-fetch

// Heroku credentials from config (may be undefined)
const appName = Config.HEROKU_APP_NAME ? Config.HEROKU_APP_NAME.trim() : '';
const authToken = Config.HEROKU_API_KEY;
const HEROKU = !!(authToken && appName); // true if both present

// Utility: reload config from require cache (used after process.env changes)
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

// Heroku helper object
const heroku = {};

/**
 * Add or update a single Heroku config var (PATCH)
 * @param {string} key
 * @param {string} value
 * @returns {Promise<{status: boolean, data: any}>}
 */
heroku.addVar = async (key, value) => {
  try {
    const headers = {
      Accept: 'application/vnd.heroku+json; version=3',
      Authorization: 'Bearer ' + authToken,
      'Content-Type': 'application/json'
    };
    const url = `https://api.heroku.com/apps/${appName}/config-vars`;
    const body = JSON.stringify({ [key]: value });
    const res = await fetch(url, { method: 'PATCH', headers, body });
    const data = await res.json();
    return { status: true, data };
  } catch (err) {
    return { status: false, data: err };
  }
};

/**
 * Get all Heroku config vars (GET)
 * @returns {Promise<{status: boolean, data: string|object}>}
 */
heroku.getAllVars = async () => {
  try {
    const headers = {
      Accept: 'application/vnd.heroku+json; version=3',
      Authorization: 'Bearer ' + authToken
    };
    const url = `https://api.heroku.com/apps/${appName}/config-vars`;
    const res = await fetch(url, { headers });
    const data = await res.json();

    // Build a formatted string listing vars
    let out = `*${appName} VARS*』 \n*________________________________________*\n`;
    Object.keys(data).forEach(key => {
      out += `*${key}* : ${(data[key] ? '`' + data[key] + '`' : '')} \n`;
    });
    return { status: true, data: out };
  } catch (err) {
    // some errors have message property
    return { status: false, data: err.message || err };
  }
};

/**
 * Get a single var value from the Heroku app object (GET app)
 * @param {string} key - property name in the app object or config (uppercased)
 * @returns {Promise<{status: boolean, data: any}>}
 */
heroku.getVar = async (key) => {
  try {
    const headers = {
      Accept: 'application/vnd.heroku+json; version=3',
      Authorization: 'Bearer ' + authToken
    };
    const url = `https://api.heroku.com/apps/${appName}`;
    const res = await fetch(url, { headers });
    const appInfo = await res.json();
    return { status: true, data: appInfo[key] };
  } catch (err) {
    return { status: false, data: err.message || err };
  }
};

/**
 * Update an existing config var (checks var exists first)
 * @param {string} key
 * @param {string} value
 * @returns {Promise<{status:boolean,data:any}>}
 */
heroku.setVarIfExists = async (key, value) => {
  try {
    const headers = {
      Accept: 'application/vnd.heroku+json; version=3',
      Authorization: 'Bearer ' + authToken,
      'Content-Type': 'application/json'
    };

    // First get existing config-vars
    const getRes = await fetch(`https://api.heroku.com/apps/${appName}/config-vars`, { method: 'GET', headers });
    if (!getRes.ok) {
      return { status: false, data: 'Failed to fetch app variables. Status: ' + getRes.status };
    }
    const current = await getRes.json();

    if (!Object.prototype.hasOwnProperty.call(current, key)) {
      return { status: false, data: 'Variable not found in app' };
    }

    // patch with new value
    const patched = { ...current, [key]: value };
    const patchRes = await fetch(`https://api.heroku.com/apps/${appName}/config-vars`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(patched)
    });

    if (patchRes.ok) {
      return { status: true, data: await patchRes.json() };
    } else {
      return { status: false, data: 'Failed to update app variable. Status: ' + patchRes.status };
    }
  } catch (err) {
    return { status: false, data: err.message || err };
  }
};

/* -------------------------
   Command handlers (smd registrations)
   ------------------------- */

/**
 * Command: sudo
 * Show list of sudo/mods (global.sudo is expected comma-separated)
 */
smd({
  cmdname: 'sudo',
  alias: ['mods', 'ssudo'],
  info: 'get sudo users list.',
  fromMe: true,
  type: 'tools',
  filename: __filename
}, async (msg) => {
  try {
    // global.sudo expected like ",123@s.whatsapp.net,456@s.whatsapp.net"
    let arr = (global.sudo || '').split(',').filter(x => x && x !== 'null').map(x => x.trim());
    const listText = arr.map((v, i) => `  ${i + 1} • ${v}\n\n`).join('');

    if (!listText || !arr || !arr[0]) {
      return await msg.reply('*There\'s no mods/sudo added for your bot!*');
    }

    const caption = `*${Config.SOME_BOTNAME ? Config.SOME_BOTNAME : 'SUHAIL-MD '}* • SUDO LIST\n\n${listText}`.trim();
    const mentions = [msg.sender, ...arr];
    return await msg.send({ image: { url: 'https://telegra.ph/file/5fd51597b0270b8cff15b.png' }, caption, mentions });
  } catch (err) {
    console.error(err);
  }
});

/**
 * Command: setsudo / addsudo
 * Add a mentioned user to sudo list
 * Usage: reply or mention a user like @123
 */
smd({
  pattern: 'setsudo',
  alias: ['addsudo', 'gsudo'],
  info: 'Make sudo to a user',
  fromMe: true,
  type: 'tools',
  filename: __filename
}, async (msg) => {
  try {
    // get mention from reply or from message text
    let mentionText = msg.reply_message ? msg.reply_message.text : (msg.quoted && msg.quoted[0]) ? msg.quoted[0] : '';
    // fallback: if msg has arguments, take first arg
    if (!mentionText && msg.clientText) mentionText = msg.clientText.split(' ')[0];

    if (!mentionText || !mentionText.includes('@')) {
      return await msg.reply('*Uhh dear, reply/mention an User*');
    }

    const number = mentionText.split('@')[0];
    if (global.sudo && global.sudo.includes(number)) {
      return await msg.reply('*Number Already Exist In Sudo!*');
    }

    global.sudo = (global.sudo || '') + ',' + number;

    let result = HEROKU ? await heroku.addVar('SUDO', global.sudo) : { status: false };
    if (result && result.status) {
      return msg.reply(`*${number} Added Succesfully.*\nSudo Numbers : \`\`\`${global.sudo}\`\`\``);
    } else {
      // where heroku not configured, we still added temporarily
      if (HEROKU) await msg.reply('*There\'s no responce from HEROKU*, \n  please check that you put valid\n  _HEROKU_APP_NAME_ & _HEROKU_API_KEY_');
      await msg.reply('*User temporary added in sudo.*');
    }
  } catch (err) {
    await msg.error(err + '\n\ncommand: setsudo', err);
  }
});

/**
 * Command: delsudo / deletesudo
 * Remove a mentioned user from sudo
 */
smd({
  pattern: 'delsudo',
  alias: ['deletesudo', 'dsudo'],
  fromMe: true,
  desc: 'delete sudo user.',
  category: 'tools',
  filename: __filename
}, async (msg) => {
  try {
    let mentionText = msg.reply_message ? msg.reply_message.text : (msg.clientText ? msg.clientText.split(' ')[0] : '');
    if (!mentionText || !mentionText.includes('@')) return await msg.reply('*Uhh dear, reply/mention an User*');

    const number = mentionText.split('@')[0];
    const search = ',' + number;
    if (global.sudo && global.sudo.includes(search)) {
      global.sudo = global.sudo.replace(search, '');
    } else {
      return await msg.reply('*_User not found in the Sudo List!_*');
    }

    let result = HEROKU ? await heroku.addVar('SUDO', global.sudo) : { status: false };
    if (result && result.status) {
      return msg.reply(`*${number} Deleted Succesfully.*\nSudo Numbers : \`\`\`${global.sudo}\`\`\``);
    } else {
      if (HEROKU) await msg.reply('*There\'s no responce from HEROKU*, \n  please check that you put valid\n  _HEROKU_APP_NAME_ & _HEROKU_API_KEY_');
      await msg.reply('*User removed from sudo.*');
    }
  } catch (err) {
    await msg.error(err + '\n\ncommand: delsudo', err);
  }
});

/**
 * Command: allvar
 * Show all heroku config vars formatted
 */
smd({
  pattern: 'allvar',
  alias: ['getallvar', 'getvars'],
  desc: 'To get all heroku variables',
  fromMe: true,
  category: 'tools',
  filename: __filename
}, async (msg) => {
  try {
    let result = await heroku.getAllVars();
    console.log({ result });
    if (result.status) {
      return msg.reply(result.data);
    } else {
      console.error(result.data);
      return msg.reply('*_There\'s no responce from HEROKU_*, \n  please check that you put valid\n  _HEROKU_APP_NAME_ & _HEROKU_API_KEY_\n``` See Console to check whats the err```');
    }
  } catch (err) {
    await msg.error(err + '\n\ncommand: allvar', err);
  }
});

/**
 * Command: getvar
 * Get a single heroku var
 * Usage: getvar VAR_NAME
 */
smd({
  pattern: 'getvar',
  desc: 'To Get A Heroku Var',
  category: 'tools',
  fromMe: true,
  filename: __filename
}, async (msg, text, { cmdName }) => {
  try {
    if (!text) return msg.reply(`To Get A Heroku Var, use: ${prefix}${cmdName} VAR_NAME`);
    const varName = text.split(' ')[0].toUpperCase();
    let result = await heroku.getVar(varName);
    if (result.status) {
      if (result.data) return msg.reply(`*${varName}* : ${result.data}`);
      else return msg.reply(`*${varName}* does not exist in Heroku *${appName}*`);
    } else {
      console.error(result.data);
      await msg.reply('*_There\'s no responce from HEROKU_*, \n  please check that you put valid\n  _HEROKU_APP_NAME_ & _HEROKU_API_KEY_');
    }
  } catch (err) {
    await msg.error(err + '\n\ncommand: getvar', err);
  }
});

/**
 * Command: setvar
 * Set a heroku config var
 * Usage: setvar KEY:VALUE
 */
smd({
  pattern: 'setvar',
  desc: 'To Set Heroku Vars',
  category: 'tools',
  fromMe: true,
  filename: __filename
}, async (msg, text, { smd: cmdName }) => {
  try {
    if (!text) return msg.reply(`*Please give me Variable Name*\n*Example : ${prefix}setvar PREFIX:null*`);
    const idx = text.indexOf(':');
    const key = text.slice(0, idx).toUpperCase().trim();
    const value = text.slice(idx + 1).trim();

    if (!value) return msg.reply(`*Please, Provide Value After ':' !*\n*Example : ${prefix}${cmdName} PREFIX:VALUE*`);

    // update local process.env and config
    process.env[key] = value;
    updateConfig();

    // update on heroku if possible
    const result = await heroku.setVarIfExists(key, value);
    if (result.status) {
      await msg.reply(`*${key}* updated to *${value}* successfully.`);
    } else {
      console.error(result.data);
      await msg.reply(result.data.toString());
    }
  } catch (err) {
    await msg.error(err + `\n\ncommand: ${cmdName}`, err);
  }
});

module.exports = heroku;
