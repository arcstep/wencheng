// pages/api/chat.js

import axios from 'axios';

const base_url = 'http://localhost:8000'

export default async function chat_history() {
  try {
    const response = await axios.get(`${base_url}/chat_history/4`);
    console.log("RESPONSE:", response.data)
    return response.data;
  } catch (error) {
    console.error("ERROR:", error);
  }
}