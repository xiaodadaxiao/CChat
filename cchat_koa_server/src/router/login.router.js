const Router = require('koa-router');
const loginController = require('../controller/login.controller')
const loginMiddleware = require('../middleware/login.middleware')
const verifyMiddleware = require('../middleware/verify.middleware')
const authMiddleware = require('../middleware/auth.middleware')
const loginRouter = new Router({ prefix: "/login" })

loginRouter.post('/',
    verifyMiddleware.verifyPassword,//校验密码格式
    loginMiddleware.checkLogin,//检查登录信息
    authMiddleware.createToken,//生成token
    loginController.login
)

module.exports = loginRouter