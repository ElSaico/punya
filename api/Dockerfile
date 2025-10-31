FROM python:3.13-slim

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/
COPY pyproject.toml uv.lock /app/

WORKDIR /app
RUN uv sync --frozen --no-cache

COPY . /app/
RUN mkdir -p /app/src/journals
RUN uv run eddi-models

CMD ["uv", "run", "fastapi", "run", "src/main.py", "--reload"]