const Socket = require('socket.io')
const app = require('../app')
const server = require('http').createServer(app.callback());
const io = Socket(server, {
    cors: true
});

io.on('connection', (socket) => {
    console.log(socket.id + ' 连接');
    socket.on('hello', (data) => { console.log(data) })

})


module.exports = server

