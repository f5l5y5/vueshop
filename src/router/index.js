import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'
// import Upload from '../components/Upload.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import GoodsList from '../components/goods/List.vue'
import Add from '../components/goods/Add.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  // 原先是/所以后面不需要加/现在是/home所以后面加/
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        // 左边菜单导航到路由通过path进行匹配自动配置到/home/users这个组件
        path: '/users',
        component: Users
      },
      {
        // 左边菜单导航到路由通过path进行匹配自动配置到/home/users这个组件
        path: '/rights',
        component: Rights
      },
      {
        // 左边菜单导航到路由通过path进行匹配自动配置到/home/users这个组件
        path: '/roles',
        component: Roles
      },
      // {
      //   // 左边菜单导航到路由通过path进行匹配自动配置到/home/users这个组件
      //   path: '/goods',
      //   component: Upload
      // },
      {
        // 左边菜单导航到路由通过path进行匹配自动配置到/home/users这个组件
        path: '/categories',
        component: Cate
      },
      {
        // 左边菜单导航到路由通过path进行匹配自动配置到/home/users这个组件
        path: '/params',
        component: Params
      },
      {
        // 左边菜单导航到路由通过path进行匹配自动配置到/home/users这个组件
        path: '/goods',
        component: GoodsList
      },
      {
        // 左边菜单导航到路由通过path进行匹配自动配置到/home/users这个组件
        path: '/goods/add',
        component: Add
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
// next()  强制跳转next('/login)
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
