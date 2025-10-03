const axios = require("axios");
const config = require("../config");
const { cmd } = require("../command");

const HEROKU_APP = config.HEROKU_APP_NAME || "";
const HEROKU_API = config.HEROKU_API_KEY || "";
const OWNER = config.OWNER_NUMBER || "923276650623";

// base URL for Heroku API
const baseURL = HEROKU_APP && HEROKU_API
  ? `https://api.heroku.com/apps/${HEROKU_APP}/config-vars`
  : null;

const headers = {
  "Accept": "application/vnd.heroku+json; version=3",
  "Authorization": `Bearer ${HEROKU_API}`
};

// ─────────────────────────────
// 🔹 Helper Functions
// ─────────────────────────────

async function getAllVars() {
  if (!baseURL) return null;
  const res = await axios.get(baseURL, { headers });
  return res.data;
}

async function getVar(key) {
  if (!baseURL) return null;
  const res = await axios.get(baseURL, { headers });
  return res.data[key];
}

async function setVar(key, value) {
  if (!baseURL) return null;
  await axios.patch(baseURL, { [key]: value }, { headers });
  return true;
}

async function deleteVar(key) {
  if (!baseURL) return null;
  await axios.patch(baseURL, { [key]: null }, { headers });
  return true;
}

// ─────────────────────────────
// 🔹 Sudo User Manager
// ─────────────────────────────
function getSudos() {
  if (!config.SUDO) return [];
  return config.SUDO.split(",").map(x => x.trim());
}

function addSudo(number) {
  let sudos = getSudos();
  if (!sudos.includes(number)) {
    sudos.push(number);
    config.SUDO = sudos.join(",");
  }
  return config.SUDO;
}

function delSudo(number) {
  let sudos = getSudos().filter(x => x !== number);
  config.SUDO = sudos.join(",");
  return config.SUDO;
}

// ─────────────────────────────
// 🔹 Commands
// ─────────────────────────────

// list all vars
cmd({
  pattern: "allvar",
  desc: "Get all Heroku config vars",
  category: "heroku",
}, async (m, conn) => {
  if (m.sender != OWNER) return;
  try {
    const vars = await getAllVars();
    let msg = "⚙️ *Heroku Vars:*\n\n";
    for (let k in vars) {
      msg += `🔑 ${k} = ${vars[k]}\n`;
    }
    conn.sendMessage(m.chat, { text: msg }, { quoted: m });
  } catch (e) {
    conn.sendMessage(m.chat, { text: "❌ Failed to fetch vars" }, { quoted: m });
  }
});

// get one var
cmd({
  pattern: "getvar",
  desc: "Get value of a specific Heroku var",
  category: "heroku",
  use: "<KEY>",
}, async (m, conn, text) => {
  if (m.sender != OWNER) return;
  try {
    const value = await getVar(text.trim());
    conn.sendMessage(m.chat, { text: `🔑 ${text} = ${value}` }, { quoted: m });
  } catch {
    conn.sendMessage(m.chat, { text: "❌ Var not found" }, { quoted: m });
  }
});

// set var
cmd({
  pattern: "setvar",
  desc: "Set new Heroku var",
  category: "heroku",
  use: "<KEY>=<VALUE>",
}, async (m, conn, text) => {
  if (m.sender != OWNER) return;
  const [key, ...val] = text.split("=");
  try {
    await setVar(key.trim(), val.join("=").trim());
    conn.sendMessage(m.chat, { text: `✅ Var *${key}* updated!` }, { quoted: m });
  } catch {
    conn.sendMessage(m.chat, { text: "❌ Failed to set var" }, { quoted: m });
  }
});

// delete var
cmd({
  pattern: "delvar",
  desc: "Delete Heroku var",
  category: "heroku",
  use: "<KEY>",
}, async (m, conn, text) => {
  if (m.sender != OWNER) return;
  try {
    await deleteVar(text.trim());
    conn.sendMessage(m.chat, { text: `🗑️ Var *${text}* deleted!` }, { quoted: m });
  } catch {
    conn.sendMessage(m.chat, { text: "❌ Failed to delete var" }, { quoted: m });
  }
});

// get sudos
cmd({
  pattern: "getsudo",
  desc: "List sudo users",
  category: "owner",
}, async (m, conn) => {
  if (m.sender != OWNER) return;
  let sudos = getSudos();
  let msg = "👑 *Sudo Users:*\n" + sudos.map(x => "• " + x).join("\n");
  conn.sendMessage(m.chat, { text: msg }, { quoted: m });
});

// add sudo
cmd({
  pattern: "setsudo",
  desc: "Add a sudo user",
  category: "owner",
  use: "<number>",
}, async (m, conn, text) => {
  if (m.sender != OWNER) return;
  addSudo(text.trim());
  conn.sendMessage(m.chat, { text: `✅ Added ${text} to sudo` }, { quoted: m });
});

// delete sudo
cmd({
  pattern: "delsudo",
  desc: "Remove sudo user",
  category: "owner",
  use: "<number>",
}, async (m, conn, text) => {
  if (m.sender != OWNER) return;
  delSudo(text.trim());
  conn.sendMessage(m.chat, { text: `🗑️ Removed ${text} from sudo` }, { quoted: m });
});
