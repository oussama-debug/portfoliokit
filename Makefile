help:
	@echo "Usage -> make <namespace>.<app>"

dev.web:
	pnpm run dev --filter web

dev.gateway:
	pnpm run dev --filter gateway