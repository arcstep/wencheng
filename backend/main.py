from fastapi import FastAPI, HTTPException
from langchain.chains import LLMChain
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.schema.output_parser import StrOutputParser
from langchain.memory import ConversationBufferWindowMemory
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.runnables import (
    ConfigurableField,
    ConfigurableFieldSpec,
    RunnableLambda,
    RunnableParallel,
    RunnablePassthrough
    )
from langchain_core.globals import set_debug
from langchain_community.llms import Tongyi
from langchain_openai import ChatOpenAI
from langchain_zhipu import ChatZhipuAI
from langserve import add_routes
from langfuse.callback import CallbackHandler
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import AsyncIterator, Any
from .chat_history import create_new_chat

# 存储对话历史
memoryStore = {}

# 记忆提取和追加
def get_memory(session_id: str) -> BaseChatMessageHistory:
    if session_id not in memoryStore:
        memoryStore[session_id] = ChatMessageHistory()
    return memoryStore[session_id]

# 设置调试模式
set_debug(False)

# 加载 .env 到环境变量
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv(), override=True)

# 
app = FastAPI(
    title="Wencheng Chat Server",
    version="1.0",
    description="我是一个能文能舞的AI智能体",
)

import os
# origins = os.getenv("WENCHENG_CORS_ORIGINS").split(",")
# print("CORS origins:", origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# 构造提示语
_prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一个强力助手，不要啰嗦。"),
    MessagesPlaceholder(variable_name="history"),
    ("human", "{question}"),
])

# 文本解析器
_parser = StrOutputParser()

# 跟踪器
_handler = CallbackHandler(trace_name="chat-agent", user_id="wencheng")

# 构造智能体
def create_chat_agent(llm, prompt = _prompt, parser = _parser, handler = _handler):
    chain = RunnableWithMessageHistory(
        prompt | llm | StrOutputParser(),
        get_memory,
        input_messages_key="question",
        history_messages_key="history",
    ).with_config({"callbacks": [handler]})
    
    return chain

#####################################
# GLM4 - ZhipuAI

def create_zhipu():
    llm = ChatZhipuAI(model="glm-4", temperature=0.01)
    return create_chat_agent(llm)

add_routes(
    app, 
    create_zhipu(),
    enabled_endpoints=["invoke", "stream", "stream_events"],
    path = "/agent/glm4")

#####################################
# GPT3

def create_gpt3():
    llm = ChatOpenAI(model = "gpt-3.5-turbo-1106", streaming = True, temperature = 0.3)
    return create_chat_agent(llm)

add_routes(
    app,
    create_gpt3(),
    enabled_endpoints=["invoke", "stream", "stream_events"],
    path = "/agent/gpt35")

#####################################
# GPT4

def craete_gpt4():
    llm = ChatOpenAI(model = "gpt-4-0125-preview", streaming = True, temperature = 0.3)
    return create_chat_agent(llm)

add_routes(
    app,
    craete_gpt4(),
    enabled_endpoints=["invoke", "stream", "stream_events"],
    path = "/agent/gpt4")

#####################################

# 查询聊天历史记录的接口
@app.get("/chat_history/{session_id}")
async def chat_history(session_id: str):
    return get_chat_history_by_session_id(session_id)

# 创建新的对话轮次
@app.post("/chat_history")
async def chat_create():
    return create_new_chat()

# 列举可用的智能体清单
@app.get("/agents")
async def agents():
    return [
        {"name": "清华智谱 GLM4", "api": "agent/glm4"},
        {"name": "OpenAI GPT4", "api": "agent/gpt4"},
        {"name": "OpenAI GPT3.5", "api": "agent/gpt35"},
    ]