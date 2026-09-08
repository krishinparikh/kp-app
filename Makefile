.PHONY: up down build logs ps migrate revision test lint shell-server shell-web clean

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

migrate: ## Apply Drizzle migrations
	docker compose exec server pnpm db:migrate

revision: ## Generate a migration from schema changes: make revision m="add accounts"
	docker compose exec server pnpm db:generate --name="$(m)"

test: ## Run the server test suite
	docker compose exec server pnpm test

lint: ## Lint every workspace package
	pnpm lint

shell-server: ## Open a shell in the server container
	docker compose exec server sh

shell-web: ## Open a shell in the web container
	docker compose exec web sh

clean: ## Stop the stack and delete the database volume
	docker compose down -v
