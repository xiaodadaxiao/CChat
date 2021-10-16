class FriendMiddleware {
    //获得好友列表
    async getList(ctx, next) {
        const { cid } = ctx.tokenInfo;
        console.log(cid);
        await next();
    }
}

module.exports = new FriendMiddleware()