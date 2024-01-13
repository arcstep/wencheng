import AbortController from "abort-controller";
import { fetchEventSource } from "@microsoft/fetch-event-source";

const base_url = process.env.NEXT_PUBLIC_BASE_URL;

export async function replyFromBot(textMessage, onEndHandler, onMessageHandler) {
  // 创建一个新的 AbortController，用于取消 fetch 请求
  const newController = new AbortController();
  let streamChunk = "";

  try {
    await fetchEventSource(`${base_url}/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "text/event-stream",
      },
      onopen(res) {
        if (res.ok && res.status === 200) {
          console.log("Connection made ", res);
        } else if (
          res.status >= 400 &&
          res.status < 500 &&
          res.status !== 429
        ) {
          console.log("Client side error ", res);
        }
      },      
      body: JSON.stringify({
        'input': { 'human_input': textMessage },
        'config': { 'configurable': { 'session_id': "4" } }
      }),
      openWhenHidden: true,
      options: {
        signal: newController.signal,
      },
      onmessage: (msg) => {
        if (msg.event === "end") {
          console.log("end")
          newController.abort();
          onEndHandler(streamChunk);
          return;
        }
        else if (msg.event === "data" && msg.data) {
          const chunk = JSON.parse(msg.data);
          // console.log("chunk: ", chunk)
          streamChunk += chunk.content;
          // console.log("streamChunk: ", streamChunk)
          onMessageHandler(streamChunk);
        }
        else {
          console.log("msg", msg)
        }
      },
      onerror: (error) => {
        console.error(error);
        console.log("close at onerror")
        newController.abort();
      },
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Fetch aborted');
    } else {
      console.error('Fetch error: ', error);
    }
  }
}