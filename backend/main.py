from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv(), override=True)

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from langchain_community.vectorstores import FAISS
from langserve import add_routes

from langchain_zhipu import ChatZhipuAI, ZhipuAIEmbeddings
from textlong.memory import MemoryManager
from textlong.chain import create_qa_chain
from textlong.knowledge import LocalFilesLoader
from textlong.project import Project, list_projects, init_project, is_project_existing

import datetime
import random

# fastapi
app = FastAPI(
    title="基于AI创作长文本",
    version="1.0",
    description="利用先进的文本生成技术，轻松创作和编辑长篇文本",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

p = Project(llm=ChatZhipuAI(), project_id="汇报资料")

add_routes(
    app,
    p.create_idea_chain(output_file="mydoc.md"),
    enabled_endpoints=["invoke", "stream"],
    path = "/agent/idea"
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