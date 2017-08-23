
const cv = require('opencv');
const through = require('through2');

const VideoCapture = cv.VideoCapture;

const matrixStream = new VideoCapture(0).toStream();

console.log('Hello there!');
matrixStream
  .pipe(through.obj((matrixObject, encoding, next) => {
  	console.log('in');
  }));