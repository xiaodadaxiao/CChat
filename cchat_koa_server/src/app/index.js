const Koa = require('koa');
const bodyparser = require('koa-bodyparser');

const useRoutersToApp = require('../router/index');
const { logger, cors } = require('../middleware/common.midddle');
const handleError = require('./error-handle');

const app = new Koa();
app.use(cors);
app.use(bodyparser());
app.use(logger);
//挂载路由
useRoutersToApp(app);

//监听错误
app.on('error', handleError);

module.exports = app;
