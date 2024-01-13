// pages/api/chat.js
import axios from 'axios';

async function chat_history() {
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

async function chat_reply(question) {
  const base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const response = await fetch(`${base_url}/chat/stream`, {
    method: 'POST',
    body: JSON.stringify({
      'input': { 'human_input': question },
      'config': {'configurable': { 'session_id': "4" }}
    }),
    headers: { 'Content-Type': 'application/json' }
  });

  return response.body.getReader();
}

export { chat_history, chat_reply };