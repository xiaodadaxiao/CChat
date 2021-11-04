const connection = require('../app/database');
/* 用户相关数据库操作 */
class UserService {
  //根据邮箱查询用户
  async getUserByEmail(email) {
    const statement = `SELECT * FROM user WHERE email=?;`;
    const result = await connection.execute(statement, [email]);
    return result[0];
  }
  //根据cid查询用户
  async getUserByCid(cid) {
    const statement = `SELECT * FROM user WHERE cid=?;`;
    const result = await connection.execute(statement, [cid]);
    return result[0];
  }
  //创建用户
  async create(email, cid, name, password) {
    const statement = `INSERT INTO user (email,cid,name,password) VALUES (?,?,?,?);`;
    //数据库操作，添加
    const [result] = await connection.execute(statement, [email, cid, name, password]);
    return result;
  }

  //修改用户信息(KeyValue)
  async updateByKeyValue(cid, key, value) {
    const statement = `UPDATE  user SET ${key}=? WHERE cid=?;`;
    const [result] = await connection.execute(statement, [value, cid]);
    return result;
  }
}

module.exports = new UserService();
