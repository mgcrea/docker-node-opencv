
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const path = require('path');

const PORT = process.env.NODE_PORT || 80;
const PUBLIC_PATH = path.resolve(__dirname, 'public');
// const MODULES_PATH = path.resolve(__dirname, 'node_modules');

server.listen(PORT);

app.use(express.static('public'));

io.on('connection', function (socket) {
  // socket.emit('news', { hello: 'world' });
  // socket.on('my other event', function (data) {
  //   console.log(data);
  // });
});

exports.app = app;
exports.io = io;
