from fastapi import FastAPI, HTTPException
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.globals import set_debug
from langserve import add_routes
from fastapi.middleware.cors import CORSMiddleware

from chat_history import withChatHistory, get_chat_history

# 设置调试模式
set_debug(True)

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

# 添加聊天接口
# Declare a chain
prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "You're an assistant by the name of Bob."),
        MessagesPlaceholder(variable_name="history"),
        ("human", "{human_input}"),
    ]
)
chain = prompt | ChatOpenAI()
add_routes(app, withChatHistory(chain), path="/chat")

# 查询聊天历史记录的接口
@app.get("/chat_history/{user_id}/{session_id}")
async def get_chat_history_by_session_id(user_id: str, session_id: str):
    hist = get_chat_history("data/chat_histories", session_id)
    return hist.messages

#
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)

