const Router = require('koa-router');
const authMiddleware = require('../middleware/auth.middleware');
const fileController = require('../controller/file.controller');
const fileMiddleware = require('../middleware/file.middleware');
const fileRouter = new Router({ prefix: '/upload' });

//上传图片
fileRouter.post(
  '/image',
  authMiddleware.checkToken, //检查token
  fileMiddleware.uploadImage,
  fileController.uploadImage
);
fileRouter.post(
  '/avatar',
  authMiddleware.checkToken, //检查token
  fileMiddleware.uploadAvatar,
  fileController.uploadAvatar
);
//得到图片
fileRouter.get('/:filetype/:filename', fileController.getImage);

module.exports = fileRouter;
