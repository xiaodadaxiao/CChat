const Socket = require('socket.io');
const app = require('../app');
const memberService = require('../service/member.service');

const { onMessage, onLastTime } = require('./message.socket');

//导入服务
const server = require('http').createServer(app.callback());
//创建io
const io = Socket(server, {
  cors: true,
});

const { checkToken, checkOnline, checkUserInfo } = require('./middleware');

const Users = require('./users');
//鉴权
io.use(checkToken);
io.use(checkOnline);
io.use(checkUserInfo);
//用户连接
io.on('connection', async socket => {
  //保存用户
  Users.set(socket.cid, socket.id);

  //加入房间
  const groups = await memberService.getUserGroupsByCid(socket.cid);
  for (let group of groups) {
    socket.join(group.gid);
  }

  //中间件检查登录情况
  socket.use((packet, next) => {
    if (Users.get(socket.cid)) {
      next();
    } else {
      socket.emit('nologin');
      next('noLogin');
    }
  });
  //断开连接
  socket.on('disconnect', () => {
    if (Users.get(socket.cid)) {
      Users.delete(socket.cid);
    }
  });

  //接收消息
  socket.on('message', (data, cb) => {
    onMessage(socket, data, cb);
  });
  //更改最后聊天时间
  socket.on('lastTime', (data, cb) => {
    onLastTime(socket, data, cb);
  });
});

module.exports = server;
