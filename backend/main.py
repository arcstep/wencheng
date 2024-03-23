from fastapi import FastAPI, HTTPException
from langchain.chains import LLMChain
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.schema.output_parser import StrOutputParser
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

# 记忆管理
from langchain_chinese import MemoryManager
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain.memory import ConversationBufferMemory, ConversationBufferWindowMemory
from langchain_chinese import WithMemoryBinding

window = ConversationBufferWindowMemory(
  return_messages=True, k=20, chat_memory = ChatMessageHistory()
)
memory = MemoryManager(shorterm_memory = window)

window0 = ConversationBufferWindowMemory(
  return_messages=True, k=0, chat_memory = ChatMessageHistory()
)
memory_window0 = MemoryManager(shorterm_memory = window)

# 构造提示语
_prompt = ChatPromptTemplate.from_messages([
    ("system", "你是一个强力助手，不要啰嗦。"),
    MessagesPlaceholder(variable_name="history"),
    ("human", "{question}"),
])

_prompt_translater = ChatPromptTemplate.from_messages([
    ("system", 
     """你是一个翻译器，无论我说什么你都从一种语言翻译到另外一种语言。
     如果我说中文，你就直接回答英文翻译结果；如果我说英文，你就直接回答中文翻译结果。
     必须严格按照内容翻译，不要额外发挥；直接给出答案即可。"""),
    MessagesPlaceholder(variable_name="history"),
    ("human", "{question}"),
])

# 跟踪器
_handler = CallbackHandler(trace_name="chat-agent", user_id="wencheng")

# 构造智能体
def create_chat_agent(llm, prompt = _prompt, handler = _handler):
    chain = WithMemoryBinding(
        prompt | llm | StrOutputParser(),
        memory,
        input_messages_key="question",
        history_messages_key="history",
    ).with_config({"callbacks": [handler]})
    return chain

#####################################
# GLM4 - ZhipuAI

def create_zhipu(prompt=_prompt):
    llm = ChatZhipuAI(model="glm-4", temperature=0.01)
    return create_chat_agent(llm)

add_routes(
    app, 
    create_zhipu(),
    enabled_endpoints=["invoke", "stream", "stream_events"],
    path = "/agent/glm4")

# GLM - 翻译器

def create_zhipu_translater():
    llm = ChatZhipuAI(model="glm-4", temperature=0.01)
    chain = WithMemoryBinding(
        _prompt_translater | llm | StrOutputParser(),
        memory_window0,
        input_messages_key="question",
        history_messages_key="history",
    ).with_config({"callbacks": [_handler]})
    return chain

add_routes(
    app, 
    create_zhipu_translater(),
    enabled_endpoints=["invoke", "stream", "stream_events"],
    path = "/agent/translater")

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

def create_gpt4():
    llm = ChatOpenAI(model = "gpt-4-0125-preview", streaming = True, temperature = 0.3)
    return create_chat_agent(llm)

add_routes(
    app,
    create_gpt4(),
    enabled_endpoints=["invoke", "stream", "stream_events"],
    path = "/agent/gpt4")

#####################################
import datetime
import random

def create_session_id():
    now = datetime.datetime.now()
    date_time = now.strftime("%Y%m%d-%H%M%S")
    random_number = random.randint(1000, 9999)
    # 组合成 session id
    session_id = f"{date_time}-{random_number}"
    return session_id

# 创建新的对话轮次
@app.post("/session")
async def chat_create():
    return create_session_id()

# 列举可用的智能体清单
@app.get("/agents")
async def agents():
    return [
        {"name": "清华智谱 GLM4", "api": "agent/glm4"},
        {"name": "OpenAI GPT4", "api": "agent/gpt4"},
        {"name": "OpenAI GPT3.5", "api": "agent/gpt35"},
        {"name": "中英互译", "api": "agent/translater"},
    ]