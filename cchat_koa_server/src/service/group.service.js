const connection = require('../app/database');
const memberTypes = require('../constant/member.constant');
class GroupService {
  //得到群信息
  async getGroupByGid(gid) {
    const statement = `SELECT * FROM \`group\` WHERE gid=?;`;
    const result = await connection.execute(statement, [gid]);
    return result[0];
  }

  //更新群信息
  async updateGroupByKeyValue(gid, key, value) {
    const statement = `UPDATE \`group\` SET ${key} = ? WHERE gid = ?;`;
    const [result] = await connection.execute(statement, [value, gid]);
    return result;
  }

  //得到群申请列表[群主]
  async getApplyListByLeaderCid(leaderCid) {
    const statement = `SELECT g.gid gid, g.gname gname ,
    ga.id apply_id ,ga.inviter_cid inviter_cid, ga.invitee_cid invitee_cid ,ga.state state,
    u.name invitee_name ,u.avatar_url invitee_avatar_url
    FROM group_apply ga
    LEFT JOIN \`group\` g ON ga.gid=g.gid
    RIGHT JOIN USER u ON u.cid  =ga.invitee_cid
    WHERE g.leader_cid =? AND ga.state=${memberTypes.APPLY_WAITING}`;
    const [result] = await connection.execute(statement, [leaderCid]);
    return result;
  }

  //得到群申请
  async getApply(gid, inviterCid, inviteedCid) {
    let statement = `SELECT * FROM group_apply WHERE gid=?`;
    let arr = [gid];
    if (inviterCid) {
      statement += ` AND inviter_cid=? `;
      arr.push(inviterCid);
    }
    if (inviteedCid) {
      statement += ` AND invitee_cid=? `;
      arr.push(inviteedCid);
    }
    const [result] = await connection.execute(statement, arr);
    return result;
  }

  //添加群申请 (群、邀请者、受邀者)
  async addApply(gid, inviterCid, inviteedCid) {
    const statement = `INSERT INTO group_apply (gid,inviter_cid,invitee_cid) VALUES (?,?,?);`;
    const [result] = await connection.execute(statement, [gid, inviterCid, inviteedCid]);
    return result;
  }
  //更新群申请
  async updateApply(gid, inviterCid, inviteedCid, state) {
    const statement = `UPDATE group_apply SET inviter_cid=?,invitee_cid=?,state=? WHERE gid =? AND invitee_cid=? ;`;
    const [result] = await connection.execute(statement, [inviterCid, inviteedCid, state, gid, inviteedCid]);
    return result;
  }

  //创建群
  async create(gid, gname, leaderCid, notice, avatarUrl) {
    const statement = `INSERT INTO \`group\` (gid,gname,leader_cid,notice,avatar_url) VALUES (?,?,?,?,?);`;
    //数据库操作，添加
    const [result] = await connection.execute(statement, [gid, gname, leaderCid, notice, avatarUrl]);
    return result;
  }
  //删除群
  async remove(gid) {
    const statement = `DELETE FROM \`group\` WHERE gid = ? ;`;
    const [result] = await connection.execute(statement, [gid]);
    return result;
  }

  //得到一个gid
  async getOneGid() {
    let statement = `SELECT * FROM gid WHERE state=?`;
    const [result] = await connection.execute(statement, ['0']);
    return result;
  }
  //修改gid
  async updateGidState(gid, state) {
    const statement = `UPDATE gid SET state=? WHERE gid =? ;`;
    const [result] = await connection.execute(statement, [state, gid]);
    return result;
  }
}

module.exports = new GroupService();
