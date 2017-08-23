
const cv = require('opencv');
const through = require('through2');
const Promise = require('bluebird');
const fs = require('fs');
const path = require('path');

Promise.promisifyAll(fs);
const VideoCapture = cv.VideoCapture;

// Config

const ROOT_PATH = path.resolve(__dirname, 'frames')
// const OBJECT_TYPE = 'frontalface_default';
// const IS_CUSTOM = false;
// const OBJECT_TYPE = 'Aravindlivewire_palm';
const OBJECT_TYPE = 'Balaje_hand';
const IS_CUSTOM = true;
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
matrixStream
  .pipe(through.obj((matrixObject, encoding, next) => {
    i = (i + 1) % 100;
    const filePath = `${ROOT_PATH}/opencv_${i}.png`;
    fs.writeFileAsync(filePath, matrixObject.toBuffer())
      .then(() => detectObject(matrixObject, OBJECT_TYPE, IS_CUSTOM))
      .tap(objects => {
        objects.forEach(object => {
          const {x, y, width, height} = object;
          console.log('Successfully detected object of type="%s" at coordinates: x=%d,y=%d,w=%d,h=%d', OBJECT_TYPE, x, y, width, height);
          // Draw rectangles around detected objects
          matrixObject.rectangle([x, y], [width, height], COLOR, 2);
        });
        return objects.length ? fs.writeFileAsync(filePath, matrixObject.toBuffer()) : null;
      })
      .then(() => {
        next(null);
      })
      .catch(next)
  }));

matrixStream.read();
