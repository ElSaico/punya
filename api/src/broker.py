import taskiq_fastapi
from taskiq import InMemoryBroker
from taskiq_nats import PullBasedJetStreamBroker
from taskiq_redis import RedisAsyncResultBackend

from .settings import settings

broker = PullBasedJetStreamBroker(
    settings.nats_urls.split(","),
    queue="punya_queue",
).with_result_backend(
    RedisAsyncResultBackend(settings.redis_url),
)

if settings.env.lower() == "pytest":
    broker = InMemoryBroker()


taskiq_fastapi.init(broker, "src.main:get_app")
