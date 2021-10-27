const { testToken } = require('../utils/token');
const errorTypes = require('../constant/error.constant');
const Users = require('./users');
const userService = require('../service/user.service');
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
//查询用户信息
async function checkUserInfo(socket, next) {
  const [userInfo] = await userService.getUserByCid(socket.cid);

  if (!userInfo) return next('nouser');
  socket.avatar_url = userInfo.avatar_url;

  next();
}

module.exports = { checkToken, checkOnline, checkUserInfo };
