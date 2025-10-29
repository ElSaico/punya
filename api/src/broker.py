import taskiq_fastapi
from taskiq import InMemoryBroker
from taskiq_redis import RedisAsyncResultBackend, RedisStreamBroker

from .settings import settings

broker = RedisStreamBroker(settings.redis_url).with_result_backend(
    RedisAsyncResultBackend(settings.redis_url)
)

if settings.env.lower() == "pytest":
    broker = InMemoryBroker()


taskiq_fastapi.init(broker, "src.main:get_app")
