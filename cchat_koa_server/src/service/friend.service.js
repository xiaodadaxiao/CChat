const connection = require('../app/database')
// 好友相关数据库操作

class FriendService {

    async getFriendsByCid(cid) {
        const statement = `SELECT * FROM friend f LEFT JOIN USER u ON f.friend_cid = u.cid  WHERE user_cid=?;`;
        const [result] = await connection.execute(statement, [cid]);
        return result;
    }
}

module.exports = new FriendService()