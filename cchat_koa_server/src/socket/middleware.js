const { testToken } = require('../utils/token');
const errorTypes = require('../constant/error.constant');
const Users = require('./users');
//校验token合法性
function checkToken(socket, next) {
  const token = socket.handshake.query.token;

  if (!token) return next(new Error(errorTypes.NOT_TOKEN));
  let tokenInfo;
  try {
    tokenInfo = testToken(token);
  } catch (error) {
    console.log(error);
    return next(new Error(errorTypes.TOKEN_INVALID));
  }
  socket.cid = tokenInfo.cid;
  next();
}
//检查用户在线
function checkOnline(socket, next) {
  //console.log('checkOnline当前用户列表：', Users);
  if (Users.get(socket.cid)) {
    return next(new Error(errorTypes.ONLINE));
  }
  next();
}

module.exports = { checkToken, checkOnline };
