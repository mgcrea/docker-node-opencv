
const cv = require('opencv');
const through = require('through2');

const VideoCapture = cv.VideoCapture;

// Config

const OBJECT_TYPE = 'frontalface_default';

// Helpers

const haarCascadePath = (objectType) => `node_modules/opencv/data/haarcascade_${objectType}.xml`;

// Code

const matrixStream = new VideoCapture(0).toStream();

matrixStream
  .pipe(through.obj((matrixObject, encoding, next) => {
    matrixObject.detectObject(haarCascadePath(OBJECT_TYPE), {}, (err, objects) => {
      if (err) {
        next(err);
      }
      objects.forEach((object) => {
        const {x, y, width, height} = object;
        console.log('Successfully detected object of type="%s" at coordinates: x=%d,y=%d,w=%d,h=%d', OBJECT_TYPE, x, y, width, height);
      })
      next(null);
    });
  }));

matrixStream.read();
