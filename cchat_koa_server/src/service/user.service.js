const connection = require('../app/database')
/* 用户相关数据库操作 */
class UserService {
    async getUserByEmail(email) {
        const statement = `SELECT * FROM user WHERE email=?;`;
        const result = await connection.execute(statement, [email]);
        return result[0];
    }
    //创建用户
    async create(email, cid, name, password) {
        const statement = `INSERT INTO user (email,cid,name,password) VALUES (?,?,?,?);`
        //数据库操作，添加
        const [result] = await connection.execute(statement, [email, cid, name, password]);
        return result
    }
}

module.exports = new UserService()