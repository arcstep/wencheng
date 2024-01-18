import AbortController from "abort-controller";

const base_url = process.env.NEXT_PUBLIC_BASE_URL;

export async function replyFromBot(textMessage, onEndHandler, onMessageHandler, action = "chat", controller = null) {
    // 如果之前的请求还没有完成，就取消它
    if (controller !== null) {
      controller.abort();
    }
  
    // 创建一个新的 AbortController，用于取消 fetch 请求
    controller = new AbortController();
  
    try {
      const response = await fetch(`${base_url}/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: textMessage, session_id: "10" }),
        signal: controller.signal, // 使用新的 AbortController 的 signal
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // 获取可读流
      const reader = response.body.getReader();

      // 读取数据
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          // 如果数据已经读取完毕，就调用 onEndHandler
          onEndHandler();
          break;
        }

        // 将 Uint8Array 转换为字符串
        const text = new TextDecoder("utf-8").decode(value);

        // 调用 onMessageHandler 处理数据
        onMessageHandler(JSON.parse(text).join(""));
      }
    } catch (error) {
      console.error("Fetch failed: ", error);
    }
}