const { PUBLIC_KEY, PRIVATE_KEY } = require('../config/index');
const jwt = require('jsonwebtoken');
//生成token
function setToken(cid) {
  return jwt.sign({ cid }, PRIVATE_KEY, {
    expiresIn: 60 * 60 * 24 * 3, //有效时间，单位秒
    // expiresIn: 60 * 60, //有效时间，单位秒
    algorithm: 'RS256', //算法
  });
}

//检查token
function testToken(token) {
  return jwt.verify(token, PUBLIC_KEY, {
    algorithms: ['RS256'],
  });
}

module.exports = { setToken, testToken };
