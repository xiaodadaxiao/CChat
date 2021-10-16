
class MessageController {
    async getList(ctx, next) {
        ctx.body = '请求消息列表' + ctx.tokenInfo.cid
    }
}
module.exports = new MessageController()