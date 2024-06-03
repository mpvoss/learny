import azure.functions as func

import fastapi

app = fastapi.FastAPI()

@app.get("/sample")
async def index():
    return {
        "info": "Try /hello/Shivani for parameterized route.",
    }


@app.get("/hola")
async def index():
    return {
        "info": "oui",
    }

@app.get("/taco")
async def index():
    return {
        "info": "mmmmm",
    }

@app.get("/umad")
async def index():
    return {
        "info": "bro",
    }

# @app.get("/pipeline")
# async def index():
#     return {
#         "info": "works",
#     }


@app.get("/swag")
async def index():
    return {
        "info": "bet",
    }

@app.get("/final")
async def index():
    return {
        "info": "countdown",
    }

@app.get("/hello/{name}")
async def get_name(name: str):
    return {
        "name": name,
    }