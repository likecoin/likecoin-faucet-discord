.PHONY: setup
setup: vendor 
	cp .env.example .env

.PHONY: vendor
vendor:
	yarn install

.PHONY: lint
lint:
	yarn lint

.PHONY: format
format: 
	yarn format

.PHONY: ci
ci:
	yarn test 
