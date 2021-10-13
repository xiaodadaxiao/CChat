const Router = require('koa-router');

const loginRouter = new Router({ prefix: "/login" })

loginRouter.get('/', (ctx, next) => {
    ctx.body = '登录接口。。。'
})

module.exports = loginRouter