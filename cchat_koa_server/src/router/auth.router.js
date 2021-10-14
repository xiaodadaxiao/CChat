const Router = require('koa-router');

const authMiddleware = require('../middleware/auth.middleware')
const authController = require('../controller/auth.controller')

const authRouter = new Router({ prefix: "/auth" })

//校验token
authRouter.post('/token',
    authMiddleware.checkToken,
    authController.checkToken
)


module.exports = authRouter