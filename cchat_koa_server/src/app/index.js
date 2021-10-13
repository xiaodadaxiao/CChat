const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors');
const useRoutersToApp = require('../router/index')

const handleError = require('./error-handle')

const app = new Koa()
app.use(cors())
app.use(bodyParser())
//挂载路由
useRoutersToApp(app)

//监听错误
app.on('error', handleError);


module.exports = app