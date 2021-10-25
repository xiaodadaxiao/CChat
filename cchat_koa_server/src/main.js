const server = require('../src/socket');

//连接数据库
require('./app/database');

//启动端口
const { APP_PORT } = require('../src/config');
server.listen(APP_PORT, () => {
  console.log(`服务器启动成功，监听${APP_PORT}端口~`);
});
