from contextlib import asynccontextmanager
import os
from typing import Union

from fastapi import FastAPI, Request
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

from dotenv import load_dotenv
from mangum import Mangum
from service.LocalLLMService import LocalLLMService

load_dotenv()


from routers import discussions, flashcards, notes, util, tags
from service.GptLLMService import GptLLMService



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
    
    # app.state.n_client.close()


class StripStagePathMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Strip '/prod' from the start of the path, API gw forwards this
        if request.url.path.startswith('/prod') or request.url.path.startswith('/test'):
            request.scope['path'] = request.url.path[5:]
        response: Response = await call_next(request)
        return response


app = FastAPI(lifespan=lifespan, root_path="/api")

# Only add the middleware if not running in local testing
if os.getenv('LOCAL_TESTING') != 'true':
    app.add_middleware(StripStagePathMiddleware)



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

@app.get("/test")
def read_item():
    return {"item_id": 'ok'}


handler = Mangum(app)

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
