const connection = require('../app/database');
class GroupService {
  //得到群信息
  async getGroupByGid(gid) {
    const statement = `SELECT * FROM \`group\` WHERE gid=?;`;
    const result = await connection.execute(statement, [gid]);
    return result[0];
  }
}

module.exports = new GroupService();
