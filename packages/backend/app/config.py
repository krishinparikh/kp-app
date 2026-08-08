from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # The repo root .env is the single source of truth. It's absent inside the
    # container, where compose injects these as real environment variables.
    model_config = SettingsConfigDict(env_file="../../.env", extra="ignore")

    database_url: str = "sqlite:///./finance.db"
    cors_origins: list[str] = ["http://localhost:5173"]


settings = Settings()
