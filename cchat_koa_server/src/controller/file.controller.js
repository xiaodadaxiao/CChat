const fs = require('fs');
const path = require('path');
const fileService = require('../service/file.service');
const userService = require('../service/user.service');
const groupService = require('../service/group.service');
const fileTypes = require('../constant/file.constant');
const { APP_HOST, APP_PORT, CLIENT } = require('../config');
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
      ctx.body = { status: 200, message: '上传成功', url: `${APP_HOST}:${APP_PORT}/upload/image/${filename}` };
    } catch (error) {
      console.log(error);
      ctx.app.emit('error', { message: '上传文件失败' }, ctx);
    }
  }
  //上传用户头像
  async uploadUserAvatar(ctx, next) {
    const cid = ctx.tokenInfo.cid;
    const { buffer, mimetype, size } = ctx.file;
    //文件名
    const filename = `${Date.now()}-${cid}-${('' + Math.floor(Math.random() * 100)).padStart(2, 'X')}`;
    const avatarPath = path.join(__dirname, '../public', 'avatar', filename);
    try {
      //保存本地
      await fs.writeFileSync(avatarPath, buffer);
      //写入数据库
      await fileService.saveImage(cid, fileTypes.FILE_USER_AVATAR, filename, mimetype, size);
      //更改用户头像
      const avatarUrl = APP_HOST + ':' + APP_PORT + '/upload/avatar/' + filename;
      await userService.updateByKeyValue(cid, 'avatar_url', avatarUrl);
      //返回数据
      ctx.body = { status: 200, message: '上传成功', url: avatarUrl };
    } catch (error) {
      console.log(error);
      ctx.app.emit('error', { message: '上传文件失败' }, ctx);
    }
  }

  //上传群头像
  async uploadGroupAvatar(ctx, next) {
    const cid = ctx.tokenInfo.cid;
    const gid = ctx.request.params.gid;
    const { buffer, mimetype, size } = ctx.file;
    //文件名
    const filename = `${Date.now()}-${cid}-${('' + Math.floor(Math.random() * 100)).padStart(2, 'X')}`;
    const avatarPath = path.join(__dirname, '../public', 'avatar', filename);
    try {
      //保存本地
      await fs.writeFileSync(avatarPath, buffer);
      //写入数据库
      await fileService.saveImage(cid, fileTypes.FILE_GROUP_AVATAR, filename, mimetype, size);
      //更改群头像
      const avatarUrl = APP_HOST + ':' + APP_PORT + '/upload/avatar/' + filename;
      await groupService.updateGroupByKeyValue(gid, 'avatar_url', avatarUrl);

      //返回数据
      ctx.body = { status: 200, message: '上传成功', url: avatarUrl };
    } catch (error) {
      console.log(error);
      ctx.app.emit('error', { message: '上传文件失败' }, ctx);
    }
  }
  //得到图片【聊天图片或者头像】
  async getImage(ctx, next) {
    const { filetype, filename } = ctx.params;

    try {
      if (!ctx.request.header.referer || ctx.request.header.referer.indexOf(CLIENT) == -1) {
        throw new Error();
      }
    } catch (error) {
      ctx.body = { status: 400, message: '内部图片，禁止访问' };
      return;
    }
    const types = {
      image: { type: fileTypes.FILE_IMAGE, path: 'image' },
      avatar: { type: fileTypes.FILE_USER_AVATAR, path: 'avatar' },
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
