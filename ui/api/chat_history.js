// pages/api/chat.js
import axios from 'axios';
const base_url = process.env.NEXT_PUBLIC_BASE_URL;

async function chat_history(chatSessionId) {
  try {
    // console.log("env:", base_url)
    const response = await axios.get(`${base_url}/chat_history/${chatSessionId}`);
    // console.log("RESPONSE:", response.data)
    return response.data;
  } catch (error) {
    console.error("ERROR:", error);
  }
}

async function chat_new() {
  try {
    // console.log("env:", base_url)
    const response = await axios.post(`${base_url}/chat_history`);
    // console.log("RESPONSE:", response.data)
    return response.data;
  } catch (error) {
    console.error("ERROR:", error);
  }
}

export { chat_history, chat_new };