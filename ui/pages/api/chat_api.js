// pages/api/chat.js

import axios from 'axios';

export default async function chat_history() {
  try {
    const base_url = process.env.NEXT_PUBLIC_BASE_URL;
    // console.log("env:", base_url)
    const response = await axios.get(`${base_url}/chat_history/4`);
    // console.log("RESPONSE:", response.data)
    return response.data;
  } catch (error) {
    console.error("ERROR:", error);
  }
}