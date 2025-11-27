# Variables
DC = sudo docker compose
APP = app

# -- Docker Control --
up:
	$(DC) up -d

down:
	$(DC) down

build:
	$(DC) up -d --build

logs:
	$(DC) logs -f

# -- Laravel Commands --
# This solves your specific complaint:
migrate:
	$(DC) exec $(APP) php artisan migrate

fresh:
	$(DC) exec $(APP) php artisan migrate:fresh --seed

tinker:
	$(DC) exec $(APP) php artisan tinker

optimize:
	$(DC) exec $(APP) php artisan optimize:clear

# -- Shell Access --
bash:
	$(DC) exec $(APP) bash

# -- Composer --
install:
	$(DC) exec $(APP) composer install

# -- Generic Artisan Command --
# Usage: make art c="make:controller MyController"
art:
	$(DC) exec $(APP) php artisan $(c)
