from contextlib import asynccontextmanager

from fastapi import FastAPI
from sqlmodel import SQLModel

from .broker import broker
from .db import engine
from .tasks import collector


@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    if not broker.is_worker_process:
        await broker.startup()
    collector_task = await collector.kiq()

    yield

    # TODO stop collector
    if not broker.is_worker_process:
        await broker.shutdown()
