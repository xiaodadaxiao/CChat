const Router = require('koa-router');
const testRouter = new Router({ prefix: '/test' });

testRouter.get('/', (ctx, next) => (ctx.body = 'test'));
module.exports = testRouter;
