const connection = require('../app/database');

class MessageService {
  //得到首页好友信息
  async getFriendMessage(cid) {
    const statement = `
    SELECT f.fcid friend_cid,f.nickname,avatar_url, content, TYPE ,updateAt,last_time
    FROM 
        (SELECT user_cid ucid ,friend_cid fcid,nickname,avatar_url,last_time  FROM friend f
          LEFT JOIN USER u ON f.friend_cid = u.cid  WHERE user_cid=?) f 
    LEFT JOIN friend_message fm 
    ON (fm.talker_cid =f.ucid OR listener_cid =f.ucid) AND (talker_cid =f.fcid OR listener_cid =f.fcid)
    WHERE  fm.updateAt=
                        (SELECT MAX(updateAt) FROM friend_message WHERE 
                        (talker_cid =f.ucid OR listener_cid =f.ucid) AND (talker_cid =f.fcid OR listener_cid =f.fcid))
    `;
    const [result] = await connection.execute(statement, [cid]);
    return result;
  }
  //得到首页群信息
  async getGroupMessage(cid) {
    const statement = `
    SELECT 
      g.gid gid,gr.gname gname, remind,content,gm.type TYPE,gm.updateAt updateAt,
       u.name talker_name,gr.avatar_url avatar_url,g.last_time
    FROM (SELECT gu.cid ucid, gid,remind,gu.last_time FROM group_user gu WHERE gu.cid =?) g
    LEFT JOIN group_message gm ON g.gid =gm.listener_gid
    LEFT JOIN USER u ON u.cid =gm.talker_cid
    LEFT JOIN \`group\` gr ON gr.gid=g.gid
    WHERE gm.updateAt =(SELECT MAX(gm.updateAt) FROM group_message gm WHERE g.gid =gm.listener_gid )
    `;
    const [result] = await connection.execute(statement, [cid]);
    return result;
  }

  //得到好友信息未读数
  async getFriendUnreadCount(cid, friendCid, lastTime) {
    const statement = `
    SELECT	COUNT(*) count FROM friend_message fm 
    WHERE (fm.talker_cid =? OR fm.listener_cid =?) 
          AND (fm.talker_cid =? OR fm.listener_cid =?)
          AND fm.updateAt >?
    `;
    const [result] = await connection.execute(statement, [cid, cid, friendCid, friendCid, lastTime]);
    return result;
  }
  //得到群信息未读数
  async getGroupUnreadCount(gid, lastTime) {
    const statement = `
    SELECT	COUNT(*) count FROM group_message gm
    WHERE gm.listener_gid=? AND gm.updateAt >?
    `;
    const [result] = await connection.execute(statement, [gid, lastTime]);
    return result;
  }

  //得到好友聊天信息
  async getFriendMessageByCid(userCid, friendCid, offset = '0', size = '10') {
    const statement = `
    SELECT fm.id id, talker_cid,listener_cid,content,fm.type type,fm.updateAt updateAt,avatar_url
    FROM friend_message fm
    LEFT JOIN USER u ON fm.talker_cid =u.cid
    WHERE (fm.talker_cid =? OR fm.listener_cid=?)AND (fm.talker_cid =? OR fm.listener_cid=?)
    ORDER BY fm.updateAt  DESC
    LIMIT ?,?
    `;
    const [result] = await connection.execute(statement, [userCid, userCid, friendCid, friendCid, offset, size]);
    return result;
  }

  //得到好友聊天总数
  async getFriendMessageCountByCid(userCid, friendCid) {
    const statement = `
    SELECT COUNT(*) count FROM friend_message fm 
    WHERE( fm.talker_cid =? OR fm.listener_cid=?)AND (fm.talker_cid =? OR fm.listener_cid=?)
    `;
    const [result] = await connection.execute(statement, [userCid, userCid, friendCid, friendCid]);
    return result;
  }
  //得到群聊天信息
  async getGroupMessageByGid(gid, offset = '0', size = '10') {
    const statement = `
    SELECT gm.id id,talker_cid,content,avatar_url,gm.updateAt updateAt,gm.type TYPE,gu.nickname nickname,role
    FROM group_message gm 
    LEFT JOIN USER u ON gm.talker_cid=u.cid
    LEFT JOIN group_user gu ON gu.cid=gm.talker_cid AND gu.gid =gm.listener_gid
    WHERE gm.listener_gid =?
    ORDER BY gm.updateAt DESC
    LIMIT ?,?
    `;
    const [result] = await connection.execute(statement, [gid, offset, size]);
    return result;
  }
  //得到群聊天总数
  async getGroupMessageCountByGid(gid) {
    const statement = `SELECT COUNT(*) count FROM group_message WHERE listener_gid=?`;
    const [result] = await connection.execute(statement, [gid]);
    return result;
  }
}

module.exports = new MessageService();
