const Router = require('koa-router');
const messageController = require('../controller/message.controller')
const authMiddleware = require('../middleware/auth.middleware')
const messageRouter = new Router({ prefix: "/message" })

messageRouter.get('/list',
    authMiddleware.checkToken,
    messageController.getList
)

module.exports = messageRouter