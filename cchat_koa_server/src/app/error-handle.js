/* 发生错误处理 */
const handleError = (err = {}, ctx) => {
    let result = {
        status: 400,
        message: '请求错误'
    }
    result = Object.assign(result, err)
    ctx.body = result
}

module.exports = handleError