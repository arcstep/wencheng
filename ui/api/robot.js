import AbortController from "abort-controller";
import { fetchEventSource } from "@microsoft/fetch-event-source";

class RetriableError extends Error {
  constructor(message) {
    super(message);
    this.name = "RetriableError";
  }
}
class FatalError extends Error {  
  constructor(message) {
    super(message);
    this.name = "FatalError";
  }
}

const base_url = process.env.NEXT_PUBLIC_BASE_URL;

export async function replyFromBot(textMessage, onEndHandler, onMessageHandler, action = "chat") {
  // 创建一个新的 AbortController，用于取消 fetch 请求
  const newController = new AbortController();
  let streamChunk = "";

  try {
    await fetchEventSource(`${base_url}/${action}/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "text/event-stream",
      },
      body: JSON.stringify({
        'input': { 'human_input': textMessage },
        'config': { 'configurable': { 'session_id': "10" } }
      }),
      openWhenHidden: true,
      options: {
        signal: newController.signal,
      },
      onmessage: (msg) => {
        if (msg.event === 'FatalError') {
          throw new FatalError(msg.data);
        }
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
      onopen(response) {
        if (response.ok) {
          console.log("event stream open well!")
          return; // everything's good
        } else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          console.log("open failed: client-side errors !")
          // client-side errors are usually non-retriable:
          newController.abort();
          throw new FatalError();
        } else {
          console.log("open failed: other errors !");
          console.log(response);
          newController.abort();
          throw new RetriableError();
        }
      },
      onclose() {
        // if the server closes the connection unexpectedly, retry:
      },      
      onerror: (error) => {
        console.error(error);
        console.log("close at onerror")
        newController.abort();
        throw(error)
      },
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Fetch aborted');
    } else {
      console.error('Fetch error: ', error);
    }
    throw error;
  }
}