import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login.vue'
// import Home from '../components/Home.vue'
// import Welcome from '../components/Welcome.vue'
// import Users from '../components/user/Users.vue'
// import Rights from '../components/power/Rights.vue'
// import Roles from '../components/power/Roles.vue'
// import Upload from '../components/Upload.vue'
// import Cate from '../components/goods/Cate.vue'
// import Params from '../components/goods/Params.vue'
// import GoodsList from '../components/goods/List.vue'
// import Add from '../components/goods/Add.vue'
// import Order from '../components/order/Order.vue'
// import Report from '../components/report/Report.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('../components/Login.vue')
  },
  // 原先是/所以后面不需要加/现在是/home所以后面加/
  {
    path: '/home',
    component: () => import('../components/Home.vue'),
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: () => import('../components/Welcome.vue')
      },

      {
        // 左边菜单导航到路由通过path进行匹配自动配置到/home/users这个组件
        path: '/users',
        component: () => import('../components/user/Users.vue')

      },
      {
        // 左边菜单导航到路由通过path进行匹配自动配置到/home/users这个组件
        path: '/rights',
        component: () => import('../components/power/Rights.vue')

      },
      {
        // 左边菜单导航到路由通过path进行匹配自动配置到/home/users这个组件
        path: '/roles',
        component: () => import('../components/power/Roles.vue')

      },
      // {
      //   // 左边菜单导航到路由通过path进行匹配自动配置到/home/users这个组件
      //   path: '/goods',
      //   component: Upload
      // },
      {
        // 左边菜单导航到路由通过path进行匹配自动配置到/home/users这个组件
        path: '/categories',
        component: () => import('../components/goods/Cate.vue')

      },
      {
        // 左边菜单导航到路由通过path进行匹配自动配置到/home/users这个组件
        path: '/params',
        component: () => import('../components/goods/Params.vue')

      },
      {
        // 左边菜单导航到路由通过path进行匹配自动配置到/home/users这个组件
        path: '/goods',
        component: () => import('../components/goods/List.vue')

      },
      {
        // 左边菜单导航到路由通过path进行匹配自动配置到/home/users这个组件
        path: '/goods/add',
        component: () => import('../components/goods/Add.vue')

      },
      {
        // 左边菜单导航到路由通过path进行匹配自动配置到/home/users这个组件
        path: '/orders',
        component: () => import('../components/order/Order.vue')

      },
      {
        // 左边菜单导航到路由通过path进行匹配自动配置到/home/users这个组件
        path: '/reports',
        component: () => import('../components/report/Report.vue')

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
