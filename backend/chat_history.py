from fastapi import HTTPException
from langchain.memory import FileChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from pathlib import Path
from typing import Callable, Union
from typing_extensions import TypedDict
import re
import os

# 从环境变量中读取聊天历史记录的存储路径
wenchdeng_chat_histories_folder = os.getenv("WENCHENG_CHAT_HISTORIES_FOLDER", "data/chat_histories")

def _is_valid_identifier(value: str) -> bool:
    """Check if the session ID is in a valid format."""
    # Use a regular expression to match the allowed characters
    valid_characters = re.compile(r"^[a-zA-Z0-9-_]+$")
    return bool(valid_characters.match(value))

def get_chat_history(session_id: str) -> FileChatMessageHistory:
    """Get a chat history from a session ID."""
    if not _is_valid_identifier(session_id):
        raise HTTPException(
            status_code=400,
            detail=f"Session ID `{session_id}` is not in a valid format. "
            "Session ID must only contain alphanumeric characters, "
            "hyphens, and underscores.",
        )
    file_path = f"{wenchdeng_chat_histories_folder}/{session_id}.json"
    return FileChatMessageHistory(str(file_path))

def create_session_factory() -> Callable[[str], BaseChatMessageHistory]:
    """Create a session ID factory that creates session IDs from a base dir.

    Args:
        base_dir: Base directory to use for storing the chat histories.

    Returns:
        A session ID factory that creates session IDs from a base path.
    """
    base_dir_ = wenchdeng_chat_histories_folder
    if not Path(base_dir_).exists():
        base_dir_.mkdir(parents=True)
    return get_chat_history

class InputChat(TypedDict):
    """Input for the chat endpoint."""

    human_input: str
    """Human input"""

def with_chat_history(chain):
    r = RunnableWithMessageHistory(
        chain,
        create_session_factory(),
        input_messages_key="human_input",
        history_messages_key="history",
    ).with_types(input_type=InputChat)
    return r

def is_history_session_exists(session_id: str):
    file_path = f"{wenchdeng_chat_histories_folder}/{session_id}.json"
    return Path(file_path).exists()

def get_chat_history_by_session_id(session_id: str):
    if(not is_history_session_exists(session_id)):
        return []
    else:
        hist = get_chat_history(session_id)
        return hist.messages

def fetch_new_chat_session():
    []
