from fastapi import FastAPI, HTTPException
from langchain_openai import ChatOpenAI
from langchain_core.runnables import RunnableLambda
from langchain.schema.output_parser import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.globals import set_debug
from langserve import add_routes
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langfuse.callback import CallbackHandler
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain_community.llms import Tongyi

# 对话历史
from backend.chat_history import create_session_factory, get_chat_history_by_session_id, create_new_chat, is_chat_session_exist
from langchain_core.runnables.history import RunnableWithMessageHistory

# 设置调试模式
set_debug(True)

# 加载 .env 到环境变量
import os
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv(), override=True)
print("LANGFUSE_PUBLIC_KEY: ", os.getenv("LANGFUSE_PUBLIC_KEY"))

app = FastAPI(
    title="Wencheng LLM Server",
    version="1.0",
    description="Wencheng Agent server based on LLM",
)

origins = os.getenv("WENCHENG_CORS_ORIGINS").split(",")
print("CORS origins:", origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


parser = StrOutputParser()

#####################################

class ChatStream(BaseModel):
    question: str
    session_id: str

@app.post("/chat_stream")
async def chat_stream(input: ChatStream):
    handler = CallbackHandler(trace_name="chat_stream", user_id="wencheng")
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You're an assistant by the name of 文成公主."),
        MessagesPlaceholder(variable_name="history"),
        ("human", "{question}"),
    ])
    # 获取 session_id 并传递给 .stream() 方法
    input_dict = input.dict(by_alias=True)
    llm = ChatOpenAI(model = "gpt-3.5-turbo", streaming = True, temperature = 0.7)
    chain = prompt | llm | parser
    chain_with_history = RunnableWithMessageHistory(
        chain,
        get_session_history=create_session_factory(),
        input_messages_key="question",
        history_messages_key="history",
    )

    return chain_with_history.stream(
        { "question": input_dict["question"] },
        { "callbacks": [handler],
          "configurable": {'session_id': input_dict["session_id"]}
        })

#####################################

class ChatOnce(BaseModel):
    question: str

@app.post("/chat_once")
async def chat_once(input: ChatOnce):
    handler = CallbackHandler(trace_name="chat_once", user_id="wencheng")
    prompt = ChatPromptTemplate.from_template(
        """{question}""")
    llm = ChatOpenAI(model = "gpt-3.5-turbo-16k", streaming = True, temperature = 0)
    chain = (prompt | llm | parser)
    return chain.stream(input = input.dict(), config={"callbacks": [handler]})

#####################################

def add_one(x: int) -> str:
    """Add one to the given number."""
    return f'The result is: {x + 1}'

def add(input: dict) -> str:
    """Add one to the given number."""
    return f'The result is: {input["x"] + input["y"]}'

handler = CallbackHandler(trace_name="add_one", user_id="wencheng")
chain = RunnableLambda(add_one).with_config({"callbacks": [handler]})
add_routes(app, chain, path = "/langserve/add_one")

handler = CallbackHandler(trace_name="add", user_id="wencheng")
chain = RunnableLambda(add).with_config({"callbacks": [handler]})
add_routes(app, chain, path = "/langserve/add")

#####################################

handler = CallbackHandler(trace_name="chat_once", user_id="wencheng")
prompt = ChatPromptTemplate.from_template(
    """{question}""")
llm = ChatOpenAI(model = "gpt-3.5-turbo-16k", streaming = True, temperature = 0.3)
chain = (prompt | llm | parser).with_config({"callbacks": [handler]})

add_routes(app, chain, path = "/langserve/gpt35")

#####################################

handler = CallbackHandler(trace_name="chat_once", user_id="wencheng")
prompt = ChatPromptTemplate.from_template(
    """{question}""")
llm = ChatOpenAI(model = "gpt-4-1106-preview", streaming = True, temperature = 0.3)
chain = (prompt | llm | parser).with_config({"callbacks": [handler]})

add_routes(app, chain, path = "/langserve/gpt4")

#####################################
handler = CallbackHandler(trace_name="chat_once", user_id="wencheng")
prompt = ChatPromptTemplate.from_template(
    """{question}""")
llm = Tongyi(model_name = "qwen-plus", streaming = True, temperature = 0.3)
chain = (prompt | llm | parser).with_config({"callbacks": [handler]})

add_routes(app, chain, path = "/langserve/tongyi")

#####################################
handler = CallbackHandler(trace_name="chat_once", user_id="wencheng")
prompt = ChatPromptTemplate.from_template(
    """{question}""")
llm = Tongyi(model_name = "chatglm3-6b", streaming = True, temperature = 0.3)
chain = (prompt | llm | parser).with_config({"callbacks": [handler]})

add_routes(app, chain, path = "/langserve/chatglm6b")

#####################################

class AutoPrompt(BaseModel):
    topic: str

@app.post("/auto_prompt")
async def auto_prompt(input: AutoPrompt):
    handler = CallbackHandler(trace_name="auto_prompt", user_id="wencheng")
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
    chain = (prompt | llm | parser)
    return chain.stream(input = input.dict(), config={"callbacks": [handler]})

# 查询聊天历史记录的接口
@app.get("/chat_history/{session_id}")
async def chat_history(session_id: str):
    return get_chat_history_by_session_id(session_id)

# 创建新的对话轮次
@app.post("/chat_history")
async def chat_create():
    return create_new_chat()