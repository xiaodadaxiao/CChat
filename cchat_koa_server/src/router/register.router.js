const Router = require('koa-router');
const registerController = require('../controller/register.controller')
const registerMiddleware = require('../middleware/register.middleware')
const verfyMiddleware = require('../middleware/verify.middleware')

const registerRouter = new Router({ prefix: "/register" })

//注册请求
registerRouter.post('/',
    verfyMiddleware.verifyEamil,//校验邮箱参数
    verfyMiddleware.verifyPassword,//校验密码参数
    registerMiddleware.checkHasUser,//校验用户是否存在
    registerMiddleware.checkCode,//校验验证码是否有效
    registerController.create
)

//请求验证码
registerRouter.post('/code',
    verfyMiddleware.verifyEamil,//校验邮箱参数
    registerMiddleware.checkHasUser,//校验用户是否存在
    registerMiddleware.checkCodeExpire,//校验验证码是否过期
    registerController.sendCode
)

module.exports = registerRouter