import AbortController from "abort-controller";
import { fetchEventSource } from "@microsoft/fetch-event-source";

export async function replyFromBot(textMessage, onEndHandler, onMessageHandler, api, controller = null, chatSessionId = "0") {
  const newController = new AbortController();
  const base_url = process.env.NEXT_PUBLIC_BASE_URL;
  let streamChunk = "";

  try {
    await fetchEventSource(`${base_url}/${api}/stream_events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "text/event-stream",
      },
      body: JSON.stringify({
        "input": { "question": textMessage },
        "config": { "configurable": { "session_id": chatSessionId }, "version": "v1" },
        "include_types": [
          "chat_model"
        ]
      }),
      onopen(res) {
        if (res.ok && res.status === 200) {
          // console.log("Connection made ", res);
        } else if (
          res.status >= 400 &&
          res.status < 500 &&
          res.status !== 429
        ) {
          // console.log("Client side error ", res);
        }
      },      
      openWhenHidden: true,
      options: {
        signal: newController.signal,
      },
      onmessage: (msg) => {
        if (msg.event === "end") {
          console.log("END")
          newController.abort();
          onEndHandler(streamChunk);
          return;
        }
        else if (msg.event === "data" && msg.data) {
          const e = JSON.parse(msg.data);
          console.log("EVENT-DATA: ", e)
          if(e.event == "on_chat_model_stream") {
            onMessageHandler(e.data.chunk.content);
          } else if(e.event == "on_chat_model_end") {
            onMessageHandler(e.data.output.generations[0][0].text);
          }
        }
        else {
          console.log("OTHER MESSAGE：", msg)
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