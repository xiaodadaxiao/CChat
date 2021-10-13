const nodemailer = require('nodemailer');
const { EMAIL_ADDRESS, EMAIL_PASSWORD } = require('../config')
//设置邮箱配置
var transport = nodemailer.createTransport({
    service: "hotmail",//(outlook 微软邮箱)
    auth: {
        user: EMAIL_ADDRESS,//邮箱账号
        pass: EMAIL_PASSWORD//邮箱密码
    }
});
//设置收件人信息
let mailOptions = {
    from: EMAIL_ADDRESS,//谁发的
    subject: '注册验证码',//主题是什么
    text: '注册账号验证码',//文本内容
};


function sendEmild(email, code) {
    mailOptions.to = email;
    mailOptions.html = `<h3>CChat聊天账号验证码为：<h1>${code}</h1>，10分钟有效！</h3>`
    return new Promise((resolve, reject) => {
        //发送邮件
        transport.sendMail(mailOptions, (error, info) => {
            console.log('error信息：', error);
            if (error) return reject(error)
            console.log(`Message消息: ${info.messageId}`);
            console.log(`sent消息: ${info.response}`);
            resolve()
        });
    })
}

module.exports = sendEmild