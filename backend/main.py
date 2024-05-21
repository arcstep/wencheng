from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv(), override=True)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_zhipu import ChatZhipuAI

from textlong import format_qa_docs, QAExcelsLoader
from textlong.prompts import create_qa_prompt, load_chat_prompt
from textlong.memory import MemoryManager, WithMemoryBinding

# 设置调试模式
from langchain_core.globals import set_debug
set_debug(False)

import datetime
import random

# fastapi
app = FastAPI(
    title="Wencheng Chat Server",
    version="1.0",
    description="我是一个能文能舞的AI智能体",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# 向量编码
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")

# QA文档加载
docs = QAExcelsLoader(user_id="public").load()

# 入库
db = FAISS.from_documents(docs, embeddings)
retriever = db.as_retriever()

# 记忆
memory = MemoryManager()

# QA Chain
def create_qa_chain():
    llm = ChatZhipuAI()
    prompt = load_chat_prompt("qa", "xiaofang", user_id="public", in_memory=False)
    chain = {
        "context":  (lambda x: x['input']) | retriever | format_qa_docs,
        "question": lambda x: x['input'],
        "history":  lambda x: x['history'],
    } | prompt | llm

    return WithMemoryBinding(chain, memory)

from langserve import add_routes
add_routes(
    app,
    create_qa_chain(),
    enabled_endpoints=["invoke", "stream", "stream_events"],
    path = "/agent/qa"
)

# 创建新的对话轮次
@app.post("/session")
async def chat_create():
    return f'{datetime.datetime.now().strftime("%Y%m%d-%H%M%S")}-{random.randint(1000, 9999)}'

# 列举可用的智能体清单
@app.get("/agents")
async def agents():
    return [
        {"name": "QA问答", "api": "agent/qa"},
    ]