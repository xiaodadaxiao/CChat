/* 登录 */

class LoginController {
  async login(ctx, next) {
    const cid = ctx.request.body.cid;
    ctx.body = {
      status: 200,
      cid,
      token: ctx.token,
      message: '登录成功',
    };
  }
}

module.exports = new LoginController();
