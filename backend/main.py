from fastapi import FastAPI
from langchain.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langserve import add_routes

# 加载 .env 到环境变量
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv(), override=True)

app = FastAPI(
    title="LangServe Server",
    version="1.0",
    description="Wencheng Agent API server",
)

# 添加OpenAI聊天模型的路由
openai_chat = ChatOpenAI()
add_routes(app, openai_chat, path="/chat")

# 添加流式聊天历史记录查询的路由
@app.get("/chat_history/{user_id}")
async def get_chat_history(user_id: str):
    # 根据user_id查询聊天历史记录的逻辑
    # 返回聊天历史记录
    return {"user_id": user_id, "history": [
        {"user_id": user_id, "text": "Hello, world!", "timestamp": "2021-01-01 00:00:00"},
        {"user_id": user_id, "text": "Hello, world!", "timestamp": "2021-01-01 00:00:00"},
        {"user_id": user_id, "text": "Hello, world!", "timestamp": "2021-01-01 00:00:00"},    
    ]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)