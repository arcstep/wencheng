from fastapi import FastAPI, HTTPException
from langchain_openai import ChatOpenAI
from langchain.schema.output_parser import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.globals import set_debug
from langserve import add_routes
from fastapi.middleware.cors import CORSMiddleware
from backend.chat_history import with_chat_history, get_chat_history_by_session_id, create_new_chat, is_chat_session_exist
from pydantic import BaseModel
from langfuse.callback import CallbackHandler

# 设置调试模式
set_debug(True)

# 加载 .env 到环境变量
import os
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv(), override=True)
print("LANGFUSE_PUBLIC_KEY: ", os.getenv("LANGFUSE_PUBLIC_KEY"))

app = FastAPI(
    title="LangServe Server",
    version="1.0",
    description="Wencheng Agent API server",
)

origins = os.getenv("WENCHENG_CORS_ORIGINS", "http://localhost:3000").split(",")
print("CORS origins:", origins)

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
        ("system", "You're an assistant by the name of 文成公主."),
        MessagesPlaceholder(variable_name="history"),
        ("human", "{human_input}"),
    ]
)

prompt_auto = ChatPromptTemplate.from_template(
"""
    Based on the following instrutions, help me write a good prompt TEMPLATE for the following task in chinese:

    {human_input}

    Notably, this prompt TEMPLATE expects that additional information will be provided by the end user of the prompt you are writing. For the piece(s) of information that they are expected to provide, please write the prompt in a format where they can be formatted into as if a Python f-string.

    When you have enough information to create a good prompt, return the prompt in the following format:\n\n```prompt\n\n...\n\n```
""")


llm = ChatOpenAI(
    model="gpt-3.5-turbo-16k",
    streaming=True,
    temperature=0,
)

add_routes(
    app,
    with_chat_history(prompt | llm),
    path="/chat",
    config_keys=["metadata", "configurable"]
)

# add_routes(
#     app,
#     prompt_once | llm,
#     path="/chat-once",
#     config_keys=["metadata", "configurable"]
# )

handler_streaming_chat = CallbackHandler(
    trace_name="streaming_chat",
    user_id="wencheng",
)
handler_once_chat = CallbackHandler(
    trace_name="once_chat",
    user_id="wencheng",
)
handler_auto_prompt = CallbackHandler(
    trace_name="auto_prompt",
    user_id="wencheng",
)

class ChatInput(BaseModel):
    input: str
class TopicInput(BaseModel):
    topic: str

parser = StrOutputParser()

@app.post("/chat_once")
async def chat_once(input: ChatInput):
    prompt = ChatPromptTemplate.from_template(
        """{input}""")
    llm = ChatOpenAI(model = "gpt-3.5-turbo-16k", streaming = True, temperature = 0)
    train = (prompt | llm | parser)
    return train.stream(
        input = input.dict(),
        config={"callbacks": [handler_once_chat]})

@app.post("/auto_prompt")
async def auto_prompt(input: TopicInput):
    prompt = ChatPromptTemplate.from_template(
    """
        Based on the following instrutions, help me write a good 
        prompt TEMPLATE for the following task in Chinese:

        {topic}

        Notably, this prompt TEMPLATE expects that additional 
        information will be provided by the end user of the prompt 
        you are writing. For the piece(s) of information that they 
        are expected to provide, please write the prompt in a format 
        where they can be formatted into as if a Python f-string.

        your prompt:

    """)
    llm = ChatOpenAI(model = "gpt-3.5-turbo", streaming = True, temperature = 1)
    train = (prompt | llm | parser)
    return train.stream(
        input = input.dict(),
        config={"callbacks": [handler_once_chat]})

# 查询聊天历史记录的接口
@app.get("/chat_history/{session_id}")
async def chat_history(session_id: str):
    return get_chat_history_by_session_id(session_id)

# 创建新的对话轮次
@app.post("/chat_history")
async def chat_create():
    return create_new_chat()