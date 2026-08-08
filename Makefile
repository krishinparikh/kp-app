.PHONY: up down build logs ps migrate revision test shell-backend shell-frontend clean

up: ## Start the dev stack in the background
	docker compose up -d

down: ## Stop the stack (keeps the database volume)
	docker compose down

build: ## Rebuild images
	docker compose build

logs: ## Tail logs from all services
	docker compose logs -f

ps: ## Show service status
	docker compose ps

migrate: ## Apply Alembic migrations
	docker compose exec backend uv run --frozen alembic upgrade head

revision: ## Autogenerate a migration: make revision m="add accounts"
	docker compose exec backend uv run --frozen alembic revision --autogenerate -m "$(m)"

test: ## Run the backend test suite
	docker compose exec backend uv run --frozen pytest

shell-backend: ## Open a shell in the backend container
	docker compose exec backend bash

shell-frontend: ## Open a shell in the frontend container
	docker compose exec frontend sh

clean: ## Stop the stack and delete the database volume
	docker compose down -v
