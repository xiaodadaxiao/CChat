const connection = require('../app/database');
const memberTypes = require('../constant/member.constant');
// 群用户 相关数据库操作
class MemberService {
  //得到群成员数量
  async getMemberCountByGid(gid) {
    const statement = `SELECT COUNT(*) count FROM group_user WHERE gid=?;`;
    const result = await connection.execute(statement, [gid]);
    return result[0];
  }
  //查询成员列表
  async getMembersByGid(gid, offset = '0', number = '5') {
    console.log(gid, offset, number);
    const statement = `SELECT *  FROM group_user WHERE gid=? LIMIT ? , ?;`;
    const result = await connection.execute(statement, [gid, offset, number]);
    return result[0];
  }
  //查询成员用户信息列表
  async getMembersUserInfoByGid(gid, offset = '0', number = '5') {
    const statement = `SELECT *  FROM group_user gu LEFT JOIN  USER u ON gu.cid=u.cid WHERE gu.gid=? LIMIT ?,?;`;
    const result = await connection.execute(statement, [gid, offset, number]);
    return result[0];
  }

  //查询用户所有群
  async getUserGroupsByCid(cid) {
    const statement = `SELECT *  FROM group_user  WHERE cid=?;`;
    const result = await connection.execute(statement, [cid]);
    return result[0];
  }

  //获取用户群聊列表
  async getGroupListByCid(cid) {
    const statement = `SELECT *  FROM group_user gu LEFT JOIN  \`group\` g ON gu.gid=g.gid WHERE gu.cid=?;`;
    const result = await connection.execute(statement, [cid]);
    return result[0];
  }

  async getOneMember(gid, cid) {
    const statement = `SELECT *  FROM group_user WHERE gid=? AND cid=?`;
    const result = await connection.execute(statement, [gid, cid]);
    return result[0];
  }

  //修改昵称
  async updateNickname(gid, cid, nickname) {
    const statement = `UPDATE group_user SET nickname = ? WHERE gid = ? AND cid=?;`;
    const [result] = await connection.execute(statement, [nickname, gid, cid]);
    return result;
  }
  //修改 接收通知
  async updateRemind(gid, cid, flag) {
    const statement = `UPDATE group_user SET remind = ? WHERE gid = ? AND cid=?;`;
    const [result] = await connection.execute(statement, [flag, gid, cid]);
    return result;
  }

  //修改用户信息(KeyValue)
  async updateMemberByKeyValue(cid, gid, key, value) {
    const statement = `UPDATE  group_user SET ${key}=? WHERE cid=? AND gid=? ;`;
    const [result] = await connection.execute(statement, [value, cid, gid]);
    return result;
  }

  //移除群用户
  async removeUserByCid(gid, cid) {
    const statement = `DELETE FROM group_user WHERE gid = ? AND cid=?;`;
    const [result] = await connection.execute(statement, [gid, cid]);
    return result;
  }

  //创建群成员
  async addMember(gid, cid, nickname, role = memberTypes.USER_ROLE_NORMAL) {
    const statement = `INSERT INTO group_user (gid,cid,nickname,role) VALUES (?,?,?,?);`;
    //数据库操作，添加
    const [result] = await connection.execute(statement, [gid, cid, nickname, role]);
    return result;
  }
}
module.exports = new MemberService();
