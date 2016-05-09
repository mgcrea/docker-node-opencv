# docker-node-opencv [![Docker Pulls](https://img.shields.io/docker/pulls/mgcrea/node-opencv.svg)](https://registry.hub.docker.com/u/mgcrea/node-opencv/)

Docker image for NodeJS with [OpenCV](http://opencv.org/)

## Quickstart

- In your shell:

```sh
docker pull mgcrea/node-opencv:2.4.12
docker run --name test_opencv -it mgcrea/node-opencv:2.4.12 /bin/bash
```

- In your `Dockerfile`:

```
FROM mgcrea/node-opencv:2.4.12
```


### Usage with `docker-compose`

```yaml
# https://docs.docker.com/compose/yml/

version: '2'
services:
  backend:
    image: mgcrea/node-opencv:2.4.12
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


### Latest tagged releases

- `mgcrea/node-opencv:2`
- `mgcrea/node-opencv:2.4`
- `mgcrea/node-opencv:2.4.12`
- `mgcrea/node-opencv:2.4.12.3`


## Links

- http://askubuntu.com/questions/412009/open-cl-in-intel
