const got = require('got');
class LocationController {
  //得到地理位置逆编码
  async getInverseCoding(ctx, next) {
    const { baiduMapKey, lat, lng } = ctx.request.query;
    //console.log(baiduMapKey, lat, lng);
    //请求百度逆编码，返回信息
    try {
      const res = await got(
        `https://api.map.baidu.com/reverse_geocoding/v3/?ak=${baiduMapKey}&output=json&coordtype=wgs84ll&location=${lat},${lng}`
      );

      ctx.body = { status: 200, data: JSON.parse(res.body) };
    } catch (error) {
      ctx.app.emit('error', { message: '请求逆编码错误' }, ctx);
      console.log(error.res.body);
    }
  }
}
module.exports = new LocationController();
