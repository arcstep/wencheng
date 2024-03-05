import { RemoteRunnable } from "@langchain/core/runnables/remote";

export async function replyFromBot(textMessage, onEndHandler, onMessageHandler, api, controller = null, chatSessionId = "0") {
  const base_url = process.env.NEXT_PUBLIC_BASE_URL;
  const chain = new RemoteRunnable({url: `${base_url}/${api}`});

  try {
    const response =  await chain.stream(
      {question: textMessage},
      {configurable: {session_id: chatSessionId}}
    );
    
    for await (const chunk of response) {
      // 第一个chunk实际上是包含 run_id 的 object，暂不使用
      // console.log(typeof chunk, chunk)      
      if(typeof chunk == "string") {
        onMessageHandler(chunk);
      }
    }
    onEndHandler();
  } catch (error) {
    console.error("Fetch failed: ", error);
  }
}
