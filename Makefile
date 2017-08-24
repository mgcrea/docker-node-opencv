DOCKER_IMAGE := mgcrea/node-opencv
OPENCV_VERSION := 3.3.0

all: build

run:
	@docker run --privileged --rm --net=host -it ${DOCKER_IMAGE}

bash:
	@docker run --privileged --rm --net=host -it ${DOCKER_IMAGE} /bin/bash

build:
	@docker build --build-arg OPENCV_VERSION=${OPENCV_VERSION} --tag=${DOCKER_IMAGE}:latest .

base:
	@docker pull node:6

rebuild: base
	@docker build --build-arg OPENCV_VERSION=${OPENCV_VERSION} --tag=${DOCKER_IMAGE}:latest .

release: rebuild
	@docker build --build-arg OPENCV_VERSION=${OPENCV_VERSION} --tag=${DOCKER_IMAGE}:${OPENCV_VERSION} .
	@scripts/tag.sh ${DOCKER_IMAGE} ${OPENCV_VERSION}

push:
	@scripts/push.sh ${DOCKER_IMAGE} ${OPENCV_VERSION}


  #  docker run --rm --entrypoint='/bin/bash' -v $(pwd)/examples/object-detection:/usr/src/app mgcrea/node-opencv:latest -c 'npm i';
  #  docker run --rm --entrypoint='/bin/bash' -v $(pwd)/examples/object-detection:/usr/src/app mgcrea/node-opencv:latest -c 'node .';
