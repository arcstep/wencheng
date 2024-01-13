let controller = null;
const baseUrl = "http://localhost:8000";

export async function replyFromBot(textMessage, signal) {
  // 如果之前的请求还没有完成，就取消它
  if (controller !== null) {
    controller.abort();
  }

  // 创建一个新的 AbortController，用于取消 fetch 请求
  controller = new AbortController();

  try {
    const response = await fetch(`${baseUrl}/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: textMessage, proxy_name: "devcto" }),
      signal: controller.signal, // 使用新的 AbortController 的 signal
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 获取响应的 Content-Type 头部
    const contentType = response.headers.get("Content-Type");

    // 在开始读取数据之前，检查请求是否已经被中断
    if (controller.signal.aborted) {
      throw new Error('Request was aborted');
    }

    // 返回响应体的读取器和 Content-Type
    return {
      reader: response.body.getReader(),
      contentType,
    };
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Fetch aborted');
    } else {
      console.error('Fetch error:', error);
    }
  }
}