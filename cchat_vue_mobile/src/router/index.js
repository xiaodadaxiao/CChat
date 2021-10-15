import Vue from 'vue'
import VueRouter from 'vue-router'
import importComponent from './importComponent'
import { checkLogin } from './guard'
/* 
 动态导入路由
*/
const components = importComponent()

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: components.Home,
    redirect: '/home/main',
    children: [
      {
        path: 'chat',
        component: components.Chat
      },
      {
        path: 'main',
        component: components.Main,
        redirect: '/home/main/index',
        children: [
          { path: 'index', component: components.Index },
          { path: 'friendslist', component: components.FriendsList },
          { path: 'other', component: components.Other }
        ]
      }
    ]
  },
  {
    path: '/login',
    component: components.Login
  },
  {
    path: '/register',
    component: components.Register,
  },
  {
    path: '/register_success',
    component: components.Success
  }
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
//路由前置守卫
router.beforeEach((to, from, next) => {

  checkLogin(to, from, next);
})

export default router
