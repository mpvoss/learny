from contextlib import asynccontextmanager
import os
from typing import Union

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from dotenv import load_dotenv

from backend.service.LocalLLMService import LocalLLMService

load_dotenv()


from .routers import discussions, flashcards, notes, util, tags
from backend.service.GptLLMService import GptLLMService



@asynccontextmanager
async def lifespan(app: FastAPI):
    ''' Run at startup
        Initialise the Client and add it to app.state
    '''
    if os.getenv("LLM_BACKEND","local") == 'openai':
        app.state.llm_service = GptLLMService()
    else:
        app.state.llm_service = LocalLLMService()
    
    yield
    ''' Run on shutdown
        Close the connection
        Clear variables and release the resources
    '''
    app.state.n_client.close()


app = FastAPI(lifespan=lifespan, root_path="/api")


app.include_router(discussions.router)
app.include_router(flashcards.router)
app.include_router(notes.router)
app.include_router(util.router)
app.include_router(tags.router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, replace with your frontend URL for production
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

#
# @app.get("/openai")
# def hit_openai():
#     return {"result": llmer.use_web()}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}



# @app.get("/disciplines")
# def get_disciplines():
#     return llmer.get_disciplines()


# @app.get("/topics")
# def get_topics(discipline:str):
#     return llmer.get_topics(discipline)


# @app.get("/outline")
# def get_topics(topic: str):
#     return llmer.get_outline(topic)


# @app.get("/questions")
# def get_topics(topic: str):
#     # raise HTTPException(status_code=404, detail="Item not found")
#     return llmer.get_questions(topic)


# @app.post("/chat")
# def chat(msg: Message):
#     return llmer.chat(msg.text)
