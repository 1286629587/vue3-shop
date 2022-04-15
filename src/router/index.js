import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Users from '../components/user/Users'
import Roles from '../components/power/Roles'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    children: [
      { path: '/users', component: Users },
      { path: '/roles', component: Roles }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
// 为路由对象添加 beforeEach 导航守卫,to:将要访问的路径; from:代表从哪个路径跳转而来; next:fn,表示放行
// next():放行; next('/login'):强制跳转
router.beforeEach((to, from, next) => {
  // 如果用户访问的登录页，直接放行
  if (to.path === '/login') return next()
  // 从 sessionStorage 中获取到保存的 token 值
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有 token，强制跳转到登陆页
  if (!tokenStr) return next('/login')
  next()
})

export default router
