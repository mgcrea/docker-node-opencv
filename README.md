# docker-node-opencv [![Docker Pulls](https://img.shields.io/docker/pulls/mgcrea/node-opencv.svg)](https://registry.hub.docker.com/u/mgcrea/node-opencv/)

Docker image for NodeJS with [OpenCV](http://opencv.org/)

## Install

- In your shell:

```sh
docker pull mgcrea/node-opencv:2.4.12.3
```

- In your `Dockerfile`:

```
FROM mgcrea/node-opencv:2.4.12.3
```

## Usage with `docker-compose`

```yaml
# https://docs.docker.com/compose/yml/

version: '2'
services:
  backend:
    image: mgcrea/node-opencv:2.4.12.3
    container_name: test_opencv
    command: "node lib"
    # command: "/usr/local/bin/npm install --verbose"
    working_dir: /srv/node
    environment:
      - LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/opencv/build/lib
      - NODE_ENV=production
    expose:
      - "3000"
    volumes:
      - .:/srv/node
      - /usr/lib/beignet:/usr/lib/beignet:ro
    devices:
      - "/dev/video0:/dev/video0"
      - "/dev/dri/card0:/dev/dri/card0"
```

```sh
docker-compose up -d
```

**NOTE**: for security reasons, starting this docker container will change the permissions of all files in your data directory to a new, docker-only user. This ensures that the docker container can access the files.

## Links

- http://askubuntu.com/questions/412009/open-cl-in-intel
