const KoaLogger = require('koa-logger');

const logger = KoaLogger((str, args) => {
  //过滤
  if (args.length > 3 && process.env.NODE_ENV.trim() !== 'development') {
    console.log(str);
  }
});

module.exports = logger;
