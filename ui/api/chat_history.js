// pages/api/chat.js
const base_url = process.env.NEXT_PUBLIC_BASE_URL;

async function chat_history(chatSessionId) {
  return []
}

async function new_session() {
  try {
    const response = await fetch(`${base_url}/session`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    // console.log("RESPONSE:", response.data)
    return response.data;
  } catch (error) {
    console.error("ERROR:", error);
  }
}

export { chat_history, new_session };