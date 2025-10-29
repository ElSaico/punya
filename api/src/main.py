from fastapi import FastAPI

from .lifespan import lifespan

# from .routers import megaships, systems

app = FastAPI(lifespan=lifespan)
# app.include_router(megaships.router)
# app.include_router(systems.router)


@app.get("/")
async def root():
    return {"message": "Punya API is operational!"}
