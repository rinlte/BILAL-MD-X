const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');

/**
 * Upload image to telegra.ph
 * @param {string|Buffer} path 
 * @returns {Promise<string>}
 */
async function uploadImage(path) {
  let data = new FormData();
  let file = fs.createReadStream(path);

  data.append("file", file);

  let res = await axios.post("https://telegra.ph/upload", data, {
    headers: {
      ...data.getHeaders()
    }
  });

  if (res.data.error) throw res.data.error;
  return "https://telegra.ph" + res.data[0].src;
}

module.exports = { uploadImage };
