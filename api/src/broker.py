import taskiq_fastapi
from taskiq import TaskiqScheduler
from taskiq_redis import RedisAsyncResultBackend, RedisScheduleSource, RedisStreamBroker

from .settings import settings

broker = RedisStreamBroker(settings.redis_url).with_result_backend(
    RedisAsyncResultBackend(settings.redis_url)
)

taskiq_fastapi.init(broker, "src.main:app")

scheduler_source = RedisScheduleSource(settings.redis_url)
scheduler = TaskiqScheduler(broker, sources=[scheduler_source])
