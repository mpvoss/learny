import os
from contextlib import asynccontextmanager
from typing import Union

from fastapi import FastAPI, Request
from mangum import Mangum
from service.LocalLLMService import LocalLLMService
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import Response
from utils.env_init import load_deploy_env

load_deploy_env()

from routers import discussions, flashcards, notes, tags, util
from service.GptLLMService import GptLLMService


@asynccontextmanager
async def lifespan(app: FastAPI):
    ''' Run at startup
        Initialise the Client and add it to app.state
    '''
    if os.getenv("LLM_BACKEND","openai") == 'openai':
        app.state.llm_service = GptLLMService()
    else:
        app.state.llm_service = LocalLLMService()
    
    yield


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
    allow_origins=["http://localhost:5173"],  # Allows all origins, replace with your frontend URL for production
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@app.get("/test")
def read_item():
    return {"item_id": 'ok'}


handler = Mangum(app)

