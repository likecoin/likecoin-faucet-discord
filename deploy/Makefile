BUILD_TAG ?= $(shell git rev-parse --short HEAD)
NAMESPACE := likecoin-faucet
ENV ?= skynet

.PHONY: deploy
deploy:
	helm -n $(NAMESPACE) upgrade -i -f ./likecoin-faucet/values-$(ENV).yaml --set image.buildTag=$(BUILD_TAG) --timeout=10m0s likecoin-faucet-$(ENV) ./likecoin-faucet