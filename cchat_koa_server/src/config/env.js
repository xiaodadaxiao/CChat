const dotenv = require('dotenv')

//将根目录的.env文件内容写入process.env
dotenv.config();
module.exports = {
    //启动端口
    APP_PORT: process.env.APP_PORT,
    APP_HOST: process.env.APP_HOST,
    //数据库相关
    MYSQL_HOST: process.env.MYSQL_HOST,
    MYSQL_PORT: process.env.MYSQL_PORT,
    MYSQL_DATABASE: process.env.MYSQL_DATABASE,
    MYSQL_USER: process.env.MYSQL_USER,
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
    //邮箱发送相关
    EMAIL_ADDRESS: process.env.EMAIL_ADDRESS,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
}