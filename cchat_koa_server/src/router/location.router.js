const Router = require('koa-router');
const authMiddleware = require('../middleware/auth.middleware');
const locationController = require('../controller/location.controller');
const locationRouter = new Router({ prefix: '/location' });
locationRouter.get(
  '/inversecoding',
  authMiddleware.checkToken, //检查token
  locationController.getInverseCoding
);
module.exports = locationRouter;
