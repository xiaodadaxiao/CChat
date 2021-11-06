const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const cors = require('koa2-cors');
const useRoutersToApp = require('../router/index');
const logger = require('../middleware/logger.midddle');
const handleError = require('./error-handle');

const app = new Koa();
app.use(cors());
app.use(bodyparser());
app.use(logger);
//挂载路由
useRoutersToApp(app);
app.use((ctx, next) => {
  console.log(1);
  next();
});
//监听错误
app.on('error', handleError);

module.exports = app;
