const friendService = require('../service/friend.service')
const pinyin = require('pinyin')
//处理好友数据
function handleFriendData(friend) {
    return {
        friendCid: friend['friend_cid'],
        nickname: friend['nickname'],
        lastTime: friend['last_time'],
        state: friend['state'],
        avatarUrl: friend['avatar_url'],
        friendName: friend['name']
    }
}
class FriendCotroller {
    //获取好友列表
    async getList(ctx, next) {
        const { cid } = ctx.tokenInfo;
        try {
            const result = await friendService.getFriendsByCid(cid)
            if (result.length <= 0) {
                ctx.body = {
                    status: 201,
                    message: '没有好友',
                    data: result
                }
            }
            //索引排序
            const data = {}
            result.forEach((friend) => {
                //获取用户昵称首文字
                const firstWord = friend.nickname.slice(0, 1)
                //将首文字转字母（返回二维数组）
                let [[code]] = pinyin(firstWord, {
                    segment: false,
                    style: pinyin.STYLE_FIRST_LETTER
                })
                if (/[a-z]/.test(code)) {
                    //属于字母
                    code = code.toUpperCase()//大写
                    if (!data[code]) {
                        data[code] = [];
                    }
                    data[code].push(handleFriendData(friend));
                } else {
                    //其他符号
                    if (!data["#"]) {
                        data["#"] = []
                    }
                    data["#"].push(handleFriendData(friend));
                }
            })
            ctx.body = {
                status: 200,
                data
            }
        } catch (error) {
            console.log(error);
            ctx.app.emit('error', { message: '获取好友列表失败' });
        }

    }
}


module.exports = new FriendCotroller()