.PHONY: run_server build_client copy_client

run_server:
	python -u vaccine_server/server.py

build_client:
	docker build -t vaccine_client_linux vaccine_client
	docker run -it -v $(PWD):/host vaccine_client_linux cp /build/target/release/vaccine_client /host/vaccine_client_linux
