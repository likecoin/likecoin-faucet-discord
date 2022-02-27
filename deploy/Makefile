BUILD_TAG ?= $(shell git rev-parse --short HEAD)
NAMESPACE := likecoin-faucet

.PHONY: deploy
deploy:
	helm -n $(NAMESPACE) upgrade -i -f ./likecoin-faucet/values.yaml --set image.buildTag=$(BUILD_TAG) --timeout=10m0s likecoin-faucet ./likecoin-faucet