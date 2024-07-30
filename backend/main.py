from functools import partial
import logging
import os
from contextlib import asynccontextmanager
from typing import Callable, Union

from fastapi import APIRouter, Depends, FastAPI, Request
from fastapi.routing import APIRoute
from fastapi_pagination import add_pagination
from mangum import Mangum
from service.QdrantService import QDrantService
from service.LocalLLMService import LocalLLMService
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import Response
from utils.env_init import load_deploy_env

load_deploy_env()

from routers import discussions, flashcards, notes, tags, util, documents, quizzes
from service.GptLLMService import GptLLMService
from utils.utils import get_current_user


@asynccontextmanager
async def lifespan(app: FastAPI):
    ''' Run at startup
    '''
    if os.getenv("LLM_BACKEND","openai") == 'openai':
        app.state.llm_service = GptLLMService()
    else:
        app.state.llm_service = LocalLLMService()


    if os.getenv("QDRANT_API_KEY", None) != None:
        app.state.qdrant_service = QDrantService()
    yield


class StripStagePathMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Strip '/prod' from the start of the path, API gw forwards this
        if request.url.path.startswith('/prod') or request.url.path.startswith('/test'):
            request.scope['path'] = request.url.path[5:]
        response: Response = await call_next(request)
        return response


app = FastAPI(lifespan=lifespan, root_path="/api")
add_pagination(app)

# Only add the middleware if not running in local testing
if os.getenv('LOCAL_TESTING') != 'true':
    app.add_middleware(StripStagePathMiddleware)



app.include_router(discussions.router)
app.include_router(flashcards.router)
app.include_router(notes.router)
app.include_router(util.router)
app.include_router(tags.router)
app.include_router(documents.router)
app.include_router(quizzes.router)


# for route in app.routes:
#     if isinstance(route, APIRoute):
#         for dep in route.dependencies:
#             if dep.dependency == Depends(get_current_user):
#                 break
#         else:
#             logging.error(f"Route {route.path} does not have a Depends(get_current_user) dependency")

# def verify_routes_have_auth_dependency(app: FastAPI, dependency: Callable):
#     print("booty booty")
#     missing_auth_routes = []
#     for route in app.routes:

#         if not hasattr(route, "dependencies"):
#             print("skippin "+ route.path)
#             continue
#         route_deps = [dep.dependency for dep in route.dependencies]
#         if not any(isinstance(dep, type(dependency)) for dep in route_deps):
#             missing_auth_routes.append(route.path)

#     if missing_auth_routes:
#         raise Exception(f"Missing authentication dependency in routes: {missing_auth_routes}")


# def verify_routes_have_auth_dependency(app: FastAPI, dependency: Callable):
#     print("booty booty")
#     missing_auth_routes = []
#     for route in app.routes:
#         if isinstance(route, APIRoute):
#             route_deps  =route.dependant.dependencies
#             if not any(isinstance(dep, type(dependency)) for dep in route_deps):
#                 missing_auth_routes.append(route.path)

#     if missing_auth_routes:
#         raise Exception(f"Missing authentication dependency in routes: {missing_auth_routes}")


# app.add_event_handler("startup", partial(verify_routes_have_auth_dependency, app, get_current_user))

# Place this check at the end of your route definitions before starting the server
# verify_routes_have_auth_dependency(app, get_current_user)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allows all origins, replace with your frontend URL for production
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


handler = Mangum(app)

