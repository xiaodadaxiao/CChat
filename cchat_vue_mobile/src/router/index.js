import Vue from 'vue';
import VueRouter from 'vue-router';
import importComponent from './importComponent';
import { checkLogin } from './guard';
/* 
 动态导入路由
*/
const components = importComponent();

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    component: components.Home,
    redirect: '/home/main',
    children: [
      //聊天面板
      {
        path: 'chat/:type/:id',
        component: components.Chat,
      },
      //首页
      {
        path: 'main',
        component: components.Main,
        redirect: '/home/main/index',
        children: [
          { path: 'index', component: components.Index },
          { path: 'friendslist', component: components.FriendsList },
          { path: 'moment', component: components.Moment },
          { path: 'profile', component: components.Profile },
        ],
      },
      //用户信息
      {
        path: 'user/:cid',
        component: components.UserInfo,
      },
      //群信息
      {
        path: 'group/:gid',
        redirect: '/home/group/:gid/info',
        component: components.Group,
        children: [
          { path: 'info', component: components.GroupInfo },
          { path: 'admin', component: components.GroupAdmin },
        ],
      },
    ],
  },
  {
    path: '/login',
    component: components.Login,
  },
  {
    path: '/register',
    component: components.Register,
  },
  {
    path: '/register_success',
    component: components.Success,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});
//路由前置守卫
router.beforeEach((to, from, next) => {
  checkLogin(to, from, next);
});

export default router;
