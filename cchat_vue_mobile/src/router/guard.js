/* 路由守卫 函数 */
import store from '@/store';
import { checkToken } from '@/network/auth';
export async function checkLogin(to, from, next) {
  //1、登录状态，直接放行
  if (store.state.isLogin) {
    return next();
  }
  //2、访问登录页或注册页
  if (to.path.indexOf('/login') !== -1 || to.path.indexOf('/register') !== -1) {
    return next();
  }
  //如果有token缓存进行判断
  if (localStorage.getItem('token')) {
    const res = await checkToken();
    //token无效
    if (res.status == 400) {
      //清除无效token缓存
      localStorage.removeItem('token');
      store.commit('useIsLogin', { flag: false });
    }
    //token有效
    if (res.status == 200) {
      store.commit('useIsLogin', { flag: true, cid: res.cid });
      return next();
    }
    if (res.status == 201) {
      store.commit('useIsLogin', { flag: true, cid: res.cid });
      //更新token
      localStorage.setItem('token', res.token);
      return next();
    }
  }
  //没有登录，且token验证不通过
  //登录界面
  next('/login');
}
