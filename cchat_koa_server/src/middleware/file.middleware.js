const path = require('path');
const multer = require('@koa/multer');
//文件上传限制
const limits = {
  fields: 10, //非文件字段的数量
  fileSize: 10 * 1024 * 1024, //文件大小 单位 b
  files: 1, //文件数量
};

//保存聊天图片
const uploadImage = multer({ limits }).single('image');
//保存用户头像
const uploadAvatar = multer({ limits }).single('avatar');

module.exports = { uploadImage, uploadAvatar };
