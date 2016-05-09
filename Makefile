DOCKER_IMAGE := mgcrea/node-opencv
OPENCV_VERSION := 2.4.12.3

all: build

build:
	@docker build --build-arg OPENCV_VERSION=${OPENCV_VERSION} --tag=${DOCKER_IMAGE}:latest .

base:
	@docker pull node:4

rebuild: base
	@docker build --build-arg OPENCV_VERSION=${OPENCV_VERSION} --tag=${DOCKER_IMAGE}:latest .

release: rebuild
	@docker build --build-arg OPENCV_VERSION=${OPENCV_VERSION} --tag=${DOCKER_IMAGE}:${OPENCV_VERSION} .
	@scripts/tag.sh ${DOCKER_IMAGE} ${OPENCV_VERSION}

push:
	@scripts/push.sh ${DOCKER_IMAGE} ${OPENCV_VERSION}
