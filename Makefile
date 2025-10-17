help:
	@echo "Usage -> make <namespace>.<app>"

dev.web:
	pnpm run dev --filter "@repo/web"

dev.gateway:
	pnpm run dev --filter "@repo/gateway"