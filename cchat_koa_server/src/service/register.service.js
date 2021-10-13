const connection = require('../app/database')
/* 注册 相关数据库操作 */
class RegisterService {
    async getRegisterByEmail(email) {
        const statement = `SELECT * FROM register WHERE email=?;`;
        const result = await connection.execute(statement, [email]);
        return result[0];
    }
    //创建一个验证码
    async create(email, code, endTime) {
        const statement = `INSERT INTO register (email,code,end_time) VALUES (?,?,?);`
        //数据库操作，添加
        const [result] = await connection.execute(statement, [email, code, endTime]);
        return result
    }
    //更新验证码
    async update(email, code, endTime) {
        const statement = `UPDATE register SET code = ?,end_time=? WHERE email = ?;`;
        //数据库操作，添加用户
        const [result] = await connection.execute(statement, [code, endTime, email]);
        return result
    }
    //得到一个可用id
    async getOneCid() {
        const statement = `SELECT * FROM cid WHERE state=?;`;
        const [result] = await connection.execute(statement, [0]);
        return result[0];
    }
    //将cid改为已注册
    async setCidToRegister(cid) {
        const statement = `UPDATE cid SET state = ? WHERE cid = ?;`;
        const [result] = await connection.execute(statement, [1, cid]);
        return result
    }
}

module.exports = new RegisterService()