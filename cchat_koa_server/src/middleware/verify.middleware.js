class VerifyMiddleware {
    async verifyEmail(ctx, next) {

        await next()
    }
}
module.exports = new VerifyMiddleware()