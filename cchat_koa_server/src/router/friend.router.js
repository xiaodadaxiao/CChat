const Router = require('koa-router');

const friendController = require('../controller/friend.controller')
const authMiddleware = require('../middleware/auth.middleware')
const friendMiddleware = require('../middleware/friend.middleware')
const friendRouter = new Router({ prefix: "/friend" })

//获得好友列表
friendRouter.get('/list',
    authMiddleware.checkToken,//检查token
    //friendMiddleware.getList,//读取好友列表
    friendController.getList,
)

module.exports = friendRouter