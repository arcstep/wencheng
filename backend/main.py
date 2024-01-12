from fastapi import FastAPI
from langchain.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langserve import add_routes
from fastapi.middleware.cors import CORSMiddleware

# 加载 .env 到环境变量
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv(), override=True)

app = FastAPI(
    title="LangServe Server",
    version="1.0",
    description="Wencheng Agent API server",
)

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
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
        {"seq":1, "user_id": user_id, "text": "你好!", "timestamp": "2021-01-01 00:00:00"},
        {"seq":2, "user_id": "文成公主", "text": "你也好!", "timestamp": "2021-01-01 00:00:01"},
        {"seq":3, "user_id": user_id, "text": "我们聊聊!", "timestamp": "2021-01-01 00:00:02"},    
    ]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)