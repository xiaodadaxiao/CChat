const connection = require('../app/database');
const frinendTypes = require('../constant/friend.constant');
// 好友相关数据库操作

class FriendService {
  //得到好友列表
  async getFriendListByCid(cid) {
    const statement = `SELECT * FROM friend f LEFT JOIN user u ON f.friend_cid = u.cid  WHERE user_cid=?;`;
    const [result] = await connection.execute(statement, [cid]);
    return result;
  }

  //更新好友信息(KeyValue)
  async updateFriendByKeyValue(userCid, friendCid, key, value) {
    const statement = `UPDATE  friend SET ${key}=? WHERE user_cid=? AND friend_cid=? ;`;
    const [result] = await connection.execute(statement, [value, userCid, friendCid]);
    return result;
  }

  //获得好友信息
  async getFriendByCid(userCid, friendCid) {
    const statement = `SELECT * FROM friend WHERE user_cid=? AND friend_cid =?;`;
    const [result] = await connection.execute(statement, [userCid, friendCid]);
    return result;
  }

  //查询两人的互相申请信息
  async getApplyByUserAndFriend(userOneCid, userTwoCid) {
    const statement = `SELECT * FROM friend_apply WHERE (user_cid=? OR user_cid=?) AND (friend_cid=? OR friend_cid=?)`;
    const [result] = await connection.execute(statement, [userOneCid, userTwoCid, userOneCid, userTwoCid]);
    return result;
  }

  //添加好友申请
  async createApply(userCid, friendCid, message) {
    const statement = `INSERT INTO friend_apply (user_cid,friend_cid,message) VALUES (?,?,?);`;
    const [result] = await connection.execute(statement, [userCid, friendCid, message]);
    return result;
  }

  //得到from 给 to发的好友请求
  async getApplyByToAndFrom(toCid, fromCid) {
    const statement = `SELECT * FROM friend_apply WHERE friend_cid=? AND user_cid =?`;
    const [result] = await connection.execute(statement, [toCid, fromCid]);
    return result;
  }

  //更改好友申请 状态
  async updateApplyStateById(id, newState) {
    const statement = `UPDATE  friend_apply SET state=? WHERE id=? ;`;
    const [result] = await connection.execute(statement, [newState, id]);
    return result;
  }
  //更改好友申请 信息
  async updateApplyMessageById(id, newMessage) {
    const statement = `UPDATE  friend_apply SET message=? WHERE id=? ;`;
    const [result] = await connection.execute(statement, [newMessage, id]);
    return result;
  }

  //添加好友信息
  async create(applyId, userCid, frendCid, nickname) {
    const statement = `INSERT INTO friend (apply_id,user_cid,friend_cid,nickname) VALUES (?,?,?,?);`;
    const [result] = await connection.execute(statement, [applyId, userCid, frendCid, nickname]);
    return result;
  }
  //得到用户的好友请求列表(state可传可不传)
  async retrieveApplyList(cid, state) {
    const statement =
      state >= 0
        ? `SELECT * FROM friend_apply  fa LEFT JOIN user u ON fa.user_cid =u.cid WHERE fa.friend_cid=? AND fa.state=?`
        : `SELECT * FROM friend_apply  fa LEFT JOIN user u ON fa.user_cid =u.cid WHERE fa.friend_cid=?`;
    const arr = state >= 0 ? [cid, state] : [cid];
    const [result] = await connection.execute(statement, arr);
    return result;
  }

  //删除好友
  async removeFriend(userCid, friendCid) {
    const statement = `DELETE FROM friend_apply WHERE  (user_cid=? OR friend_cid=?) AND  (user_cid=? OR friend_cid=?);`;
    const [result] = await connection.execute(statement, [userCid, userCid, friendCid, friendCid]);
    return result;
  }

  //得到黑名单列表
  async getBackList(userCid) {
    const statement = `SELECT apply_id,friend_cid,nickname,f.state state, name,avatar_url 
                        FROM friend  f LEFT JOIN user u ON u.cid=f.friend_cid 
                        WHERE f.user_cid=10000 AND f.state=${frinendTypes.BLACKLIST}`;
    const [result] = await connection.execute(statement, [userCid]);
    return result;
  }
}

module.exports = new FriendService();
