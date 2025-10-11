import fetch from "node-fetch";

/**
 * Simple fetch wrapper with retries
 * @param {string} url - API endpoint
 * @param {object} options - fetch options
 * @param {number} retries - retry count
 */
const fetchWithRetry = async (url, options, retries = 3) => {
  let attempt = 0;
  let lastError;

  while (attempt < retries) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
      return await res.buffer();
    } catch (err) {
      lastError = err;
      console.error(`⚠️ Error during fetch attempt ${attempt + 1}:`, err.message);
      if (attempt >= retries - 1) throw lastError;
      console.log("🔁 Retrying...");
      attempt++;
    }
  }
};

/**
 * Enhance or fix image using PrinceTech Remini API
 * 
 * @param {string} imageUrl - URL of the image to enhance
 * @returns {Promise<Buffer>} enhanced image buffer
 */
const remini = async (imageUrl) => {
  if (!imageUrl) throw new Error("Image URL is required!");

  const apiUrl = `https://api.princetechn.com/api/tools/remini?apikey=prince&url=${encodeURIComponent(imageUrl)}`;

  console.log(`🧠 Enhancing image using PrinceTech API`);
  console.log(`🌐 API: ${apiUrl}`);

  try {
    const result = await fetchWithRetry(apiUrl, {
      method: "GET",
    });

    console.log("✅ Image successfully enhanced (PrinceTech API).");
    return result;
  } catch (err) {
    console.error("❌ Error enhancing image:", err);
    throw new Error("Image enhancement failed. Please try again later.");
  }
};

export default remini;
