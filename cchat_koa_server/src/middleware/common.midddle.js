const KoaLogger = require('koa-logger');
const KoaCors = require('koa2-cors');
const { CLIENT } = require('../config');
/* 日志 */
const logger = KoaLogger((str, args) => {
  //过滤
  if (args.length > 3 && process.env.NODE_ENV.trim() !== 'development') {
    console.log(str);
  }
});
/* cors */
const cors = KoaCors({
  origin: function (ctx) {
    return CLIENT;
  },
});
module.exports = { logger, cors };
