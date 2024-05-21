import AbortController from "abort-controller";
import { fetchEventSource } from "@microsoft/fetch-event-source";

export async function replyFromBot(textMessage, onEndHandler, onMessageHandler, api, controller = null, chatSessionId) {
  const newController = new AbortController();
  const base_url = process.env.NEXT_PUBLIC_BASE_URL;

  const abort = () => {
    newController.abort();
    onEndHandler();
  }

  try {
    await fetchEventSource(`${base_url}/${api}/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "text/event-stream",
      },
      body: JSON.stringify({
        "input": { "input": textMessage },
        "config": { "configurable": { "session_id": chatSessionId }}
      }),
      onopen(res) {
        if (
          res.status >= 400 &&
          res.status < 500 &&
          res.status !== 429
        ) {
          console.log("Client Error ", res);
          return(abort())
        } else if(!res.ok || res.status != 200) {
          console.log("Other Error ", res);
          return(abort())
        }
      },      
      openWhenHidden: true,
      options: {
        signal: newController.signal,
      },
      onmessage: (msg) => {
        if (msg.event === "end") {
          console.log("END")
          return(abort())
        }
        else if (msg.event === "data" && msg.data) {
          // console.log(msg.data)
          const e = JSON.parse(msg.data);
          onMessageHandler(e.content);
        }
        else {
          console.log("UNKNOWN MESSAGE：", msg)
        }
      },
      onerror: (error) => {
        console.error(error);
        console.log("close at onerror")
        newController.abort();
      },
    });
  } catch (error) {
    console.log(error);
    return(abort())
  }
}