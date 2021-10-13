import Vue from 'vue'
import VueRouter from 'vue-router'

/* 
 导入路由
*/
const Home = () => import('@/views/home/Home')
const Login = () => import('@/views/login/Login')
const Register = () => import('@/views/register/Register')
const RegisterSuccess = () => import('@/views/register/Success')
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/register',
    component: Register,
  },
  {
    path: '/register_success',
    component: RegisterSuccess
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
