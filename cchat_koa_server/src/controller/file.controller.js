const fs = require('fs');
const path = require('path');
const fileService = require('../service/file.service');
const fileTypes = require('../constant/file.constant');
const { APP_HOST, APP_PORT } = require('../config');
class FileController {
  //上传聊天图片
  async uploadImage(ctx, next) {
    const cid = ctx.tokenInfo.cid;
    const { buffer, mimetype, size } = ctx.file;
    const filename = `${Date.now()}-${('' + Math.floor(Math.random() * 100)).padStart(2, 'X')}`;
    const imagePath = path.join(__dirname, '../public', 'image', filename);
    try {
      //保存本地
      await fs.writeFileSync(imagePath, buffer);
      //写入数据库
      await fileService.saveImage(cid, fileTypes.FILE_IMAGE, filename, mimetype, size);
      //返回数据
      ctx.body = { status: 200, message: '上传成功', url: `http://${APP_HOST}:${APP_PORT}/upload/image/${filename}` };
    } catch (error) {
      console.log(error);
      ctx.app.emit('error', { message: '上传文件失败' }, ctx);
    }
  }
  //上传头像
  async uploadAvatar(ctx, next) {
    const cid = ctx.tokenInfo.cid;
    const { buffer, mimetype, size } = ctx.file;
    //文件名
    const filename = `${Date.now()}-${cid}-${('' + Math.floor(Math.random() * 100)).padStart(2, 'X')}`;
    const avatarPath = path.join(__dirname, '../public', 'avatar', filename);
    try {
      //保存本地
      await fs.writeFileSync(avatarPath, buffer);
      //写入数据库
      await fileService.saveImage(cid, fileTypes.FILE_AVATAR, filename, mimetype, size);
      //返回数据
      ctx.body = { status: 200, message: '上传成功', url: APP_HOST + ':' + APP_PORT + '/upload/avatar/' + filename };
    } catch (error) {
      console.log(error);
      ctx.app.emit('error', { message: '上传文件失败' }, ctx);
    }
  }

  //得到图片【聊天图片或者头像】
  async getImage(ctx, next) {
    const { filetype, filename } = ctx.params;
    const types = {
      image: { type: fileTypes.FILE_IMAGE, path: 'image' },
      avatar: { type: fileTypes.FILE_AVATAR, path: 'avatar' },
    };
    try {
      //读取图片信息
      const imageInfo = await fileService.getImage(filename, types[filetype].type);
      if (!imageInfo) return ctx.app.emit('error', new Error('无法获取图片'), ctx);
      ctx.response.set('content-type', imageInfo.mimetype);
      ctx.body = fs.createReadStream(path.join(__dirname, '../public', types[filetype].path, filename));
    } catch (e) {
      return ctx.app.emit('error', new Error('获取图片失败'), ctx);
    }
  }
}

module.exports = new FileController();
