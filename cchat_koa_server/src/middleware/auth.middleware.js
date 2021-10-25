/* 权限相关中间件 */

const { setToken, testToken } = require('../utils/token');

class AuthMiddleware {
  //生成token
  async createToken(ctx, next) {
    const { cid } = ctx.request.body;
    const token = setToken(cid);
    ctx.token = token;
    await next();
  }

  //检查token
  async checkToken(ctx, next) {
    //去掉请求头默认前缀 获得token
    const token = ctx.headers.authorization && ctx.headers.authorization.replace('Bearer ', '');
    if (!token) {
      return ctx.app.emit('error', { message: '无token凭证' }, ctx);
    }

    let tokenInfo;
    try {
      tokenInfo = testToken(token);
    } catch (err) {
      return ctx.app.emit('error', { message: 'token无效' }, ctx);
    }
    //tokenInfo:{ cid: '10000', iat: 1634216295, exp: 1634216355 }// 单位秒
    ctx.tokenInfo = tokenInfo;
    await next();
  }

  //更新token
  async updateToken(ctx, next) {
    const { exp, cid } = ctx.tokenInfo;
    const timeDiff = exp * 1000 - Date.now(); //token剩余时间（单位秒*1000=>毫秒）
    const minTime = 1000 * 60 * 60 * 24 * 1; //结束时间小于1天内，则更新token
    if (!(timeDiff < minTime)) {
      //并不是小于一天，不用更新
      // console.log('无需更新token', timeDiff);
      await next();
    } else {
      // console.log('需要更新token');
      ctx.newToken = getToken(cid);
      await next();
    }
  }
}
module.exports = new AuthMiddleware();
