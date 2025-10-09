import fetch from "node-fetch";
import FormData from "form-data";

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
 * Enhance or fix image using Vyro AI API
 * Modes: "enhance" (default), "dehaze", "recolor"
 * 
 * @param {Buffer} imageBuffer - image file buffer
 * @param {string} mode - enhancement type
 * @returns {Promise<Buffer>} enhanced image buffer
 */
const remini = async (imageBuffer, mode = "enhance") => {
  const validModes = ["enhance", "dehaze", "recolor"];
  if (!validModes.includes(mode)) mode = "enhance";

  const apiUrl = `https://inferenceengine.vyro.ai/${mode}`;
  const form = new FormData();

  // Model version and file data
  form.append("model_version", "1");
  form.append("image", imageBuffer, {
    filename: "image.jpg",
    contentType: "image/jpeg"
  });

  console.log(`🧠 Enhancing image using mode: ${mode}`);
  console.log(`🌐 API: ${apiUrl}`);

  try {
    const result = await fetchWithRetry(apiUrl, {
      method: "POST",
      body: form,
      headers: form.getHeaders()
    });

    console.log("✅ Image successfully enhanced.");
    return result;
  } catch (err) {
    console.error("❌ Error enhancing image:", err);
    throw new Error("Image enhancement failed. Please try again later.");
  }
};

export default remini;
