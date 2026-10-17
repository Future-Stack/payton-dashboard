# Variables
IMAGE_NAME = softvence/payton-dashboard
TAG = latest
FULL_IMAGE = $(IMAGE_NAME):$(TAG)

.PHONY: build push up down logs restart clean

# Build the docker image (targeting VPS linux/amd64 architecture)
build:
	@docker build --platform linux/amd64 -t $(FULL_IMAGE) .

# Push the docker image to the registry
push:
	@docker push $(FULL_IMAGE)

# Start containers in background
up:
	@docker compose up -d

# Stop and remove containers
down:
	@docker compose down

# View real-time container logs
logs:
	@docker compose logs -f

# Restart the application containers
restart: down up

# Clean dangling docker images and build cache
clean:
	@docker system prune -f
