from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    env: str = Field(default="dev")
    postgres_url: str = Field(default="postgresql://app:app@localhost:5432/app")
    redis_url: str = Field(default="redis://localhost")

    class Config:
        env_file = ".env"
        env_prefix = "FASTAPI_APP_"


settings = Settings()
