import re
from pathlib import Path
from typing import Callable, Union

from fastapi import FastAPI, HTTPException
from langchain_openai import ChatOpenAI
from langchain.memory import FileChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory
from typing_extensions import TypedDict
from langchain_core.globals import set_debug
from langserve import add_routes
from fastapi.middleware.cors import CORSMiddleware

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

def _is_valid_identifier(value: str) -> bool:
    """Check if the session ID is in a valid format."""
    # Use a regular expression to match the allowed characters
    valid_characters = re.compile(r"^[a-zA-Z0-9-_]+$")
    return bool(valid_characters.match(value))

def get_chat_history(base_dir_: str, session_id: str) -> FileChatMessageHistory:
    """Get a chat history from a session ID."""
    if not _is_valid_identifier(session_id):
        raise HTTPException(
            status_code=400,
            detail=f"Session ID `{session_id}` is not in a valid format. "
            "Session ID must only contain alphanumeric characters, "
            "hyphens, and underscores.",
        )
    file_path = f"{base_dir_}/{session_id}.json"
    return FileChatMessageHistory(str(file_path))

def create_session_factory(
    base_dir: Union[str, Path],
) -> Callable[[str], BaseChatMessageHistory]:
    """Create a session ID factory that creates session IDs from a base dir.

    Args:
        base_dir: Base directory to use for storing the chat histories.

    Returns:
        A session ID factory that creates session IDs from a base path.
    """
    base_dir_ = Path(base_dir) if isinstance(base_dir, str) else base_dir
    if not base_dir_.exists():
        base_dir_.mkdir(parents=True)
    def __get_chat_history(session_id: str) -> FileChatMessageHistory:
        return get_chat_history(base_dir_, session_id)
    return __get_chat_history

app = FastAPI(
    title="LangChain Server",
    version="1.0",
    description="Spin up a simple api server using Langchain's Runnable interfaces",
)

# Declare a chain
prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "You're an assistant by the name of Bob."),
        MessagesPlaceholder(variable_name="history"),
        ("human", "{human_input}"),
    ]
)

chain = prompt | ChatOpenAI()

class InputChat(TypedDict):
    """Input for the chat endpoint."""

    human_input: str
    """Human input"""

chain_with_history = RunnableWithMessageHistory(
    chain,
    create_session_factory("chat_histories"),
    input_messages_key="human_input",
    history_messages_key="history",
).with_types(input_type=InputChat)

add_routes(
    app,
    chain_with_history,
    path="/chat",
)

# 查询聊天历史记录的接口
@app.get("/chat_history/{user_id}/{session_id}")
async def get_chat_history_by_session_id(user_id: str, session_id: str):
    # 根据session_id查询聊天历史记录的逻辑
    # 返回聊天历史记录
    hist = get_chat_history("chat_histories", session_id)
    return hist.messages

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)

