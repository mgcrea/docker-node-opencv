OPENCV_VERSION := 2.4.12.3

all: build

build:
	@docker build --build-arg OPENCV_VERSION=${OPENCV_VERSION} --tag=mgcrea/node-opencv:latest .

base:
	@docker pull node:4

rebuild: base
	@docker build --build-arg OPENCV_VERSION=${OPENCV_VERSION} --tag=mgcrea/node-opencv:latest .

release: rebuild
	@docker build --build-arg OPENCV_VERSION=${OPENCV_VERSION} --tag=mgcrea/node-opencv:${OPENCV_VERSION} .
