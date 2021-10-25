const Socket = require('socket.io');
const app = require('../app');
//导入服务
const server = require('http').createServer(app.callback());
//创建io
const io = Socket(server, {
  cors: true,
});

const { checkToken, checkOnline } = require('./middleware');

const Users = require('./users');
//鉴权
io.use(checkToken);
io.use(checkOnline);
//用户连接
io.on('connection', socket => {
  //保存用户
  Users.set(socket.cid, socket.id);
  //console.log('【connection】', Users);

  //断开连接
  socket.on('disconnect', () => {
    if (Users.get(socket.cid)) {
      Users.delete(socket.cid);
    }
    //console.log('【disconnect】', Users);
  });
});

module.exports = server;
