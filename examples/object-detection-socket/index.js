
const cv = require('opencv');
const through = require('through2');
const Promise = require('bluebird');
const fs = require('fs');
const path = require('path');

const {app, io} = require('./server');

Promise.promisifyAll(fs);
const VideoCapture = cv.VideoCapture;

// Config

const PUBLIC_PATH = path.resolve(__dirname, 'public');
const OBJECT_TYPE = 'frontalface_default';
const IS_CUSTOM = false;
// const OBJECT_TYPE = 'Aravindlivewire_aGest';
// const OBJECT_TYPE = 'Aravindlivewire_palm';
// const OBJECT_TYPE = 'Balaje_hand';
// const IS_CUSTOM = true;
const COLOR = [0, 255, 0]; // green

// Helpers

const haarCascadePath = (objectType, isCustom) =>
  isCustom ? `./data/haarcascade_${objectType}.xml` : `node_modules/opencv/data/haarcascade_${objectType}.xml`;

const detectObject = (matrixObject, objectType, isCustom) =>
  new Promise((resolve, reject) =>
    matrixObject.detectObject(haarCascadePath(objectType, isCustom), {}, (err, objects) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(objects);
    }));

// Code

const matrixStream = new VideoCapture(0).toStream();

let i = 0;
let t = +new Date();
matrixStream
  .pipe(through.obj((matrixObject, encoding, next) => {
    // Rate limiter
    if (+new Date - t < 1000 / 60) {
      next(null);
      return;
    }
    i = (i + 1) % 100;
    const frameSrc = `/frames/opencv_${i}.png`;
    const filePath = path.join(PUBLIC_PATH, frameSrc);
    fs.writeFileAsync(filePath, matrixObject.toBuffer())
      .then(() => detectObject(matrixObject, OBJECT_TYPE, IS_CUSTOM))
      .tap(objects => {
        objects.forEach(object => {
          const {x, y, width, height} = object;
          console.log('Successfully detected object of type="%s" at coordinates: x=%d,y=%d,w=%d,h=%d', OBJECT_TYPE, x, y, width, height);
          // Draw rectangles around detected objects
          matrixObject.rectangle([x, y], [width, height], COLOR, 2);
        });
        return fs.writeFileAsync(filePath, matrixObject.toBuffer());
      })
      .then(objects => {
        (objects.length ? io.sockets : io.sockets.volatile).emit('detection', {objects, frameSrc, createdAt: new Date()});
      })
      // .delay(1000 / 30) // 60fps
      .then(() => {
        t = +new Date();
        next(null);
      })
      .catch(next)
  }));

matrixStream.read();
