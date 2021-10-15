const Router = require('koa-router');

const authMiddleware = require('../middleware/auth.middleware')
const authController = require('../controller/auth.controller')

const authRouter = new Router({ prefix: "/auth" })

//校验token
authRouter.post('/token',
    authMiddleware.checkToken,//检查token
    authMiddleware.updateToken,//是否需要更新token
    authController.checkToken
)


module.exports = authRouter