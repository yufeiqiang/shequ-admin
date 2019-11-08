import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import componentsRouter from './modules/components'
import organRouter from './modules/organ'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard', affix: true }
    }]
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

export const asyncRoutes = [
  organRouter,
  {
    path: '/house',
    component: Layout,
    redirect: '/house/village',
    name: 'house',
    meta: { title: '房屋信息', icon: 'house' },
    children: [
      {
        path: 'village',
        name: 'Village',
        component: () => import('@/views/village/index'),
        meta: { title: '小区', icon: 'village' }
      },
      {
        path: 'building',
        name: 'Building',
        component: () => import('@/views/building/index'),
        meta: { title: '楼栋', icon: 'form' }
      },
      {
        path: 'room',
        name: 'Room',
        component: () => import('@/views/room/index'),
        meta: { title: '房间', icon: 'room' }
      }
    ]
  },
  {
    path: '/userinfo',
    component: Layout,
    redirect: '/userinfo/table',
    name: 'userinfo',
    meta: { title: '用户信息', icon: 'userinfo' },
    children: [
      {
        path: 'userdata',
        name: 'Userdata',
        component: () => import('@/views/userdata/index'),
        meta: { title: '用户资料', icon: 'userinfo' }
      },
      {
        path: 'face',
        name: 'Face',
        component: () => import('@/views/face/index'),
        meta: { title: '人脸信息', icon: 'face' }
      }
    ]
  },
  {
    path: '/repair',
    component: Layout,
    redirect: '/repair/online',
    name: 'repair',
    meta: {
      title: '维修',
      icon: 'online'
    },
    children: [
      {
        path: 'online',
        name: 'Online',
        component: () => import('@/views/online/index'),
        meta: { title: '在线维修', icon: 'online' }
      },
      {
        path: 'personnel',
        name: 'personnel',
        component: () => import('@/views/personnel/index'),
        meta: { title: '维修人员', icon: 'personnel' }
      }
    ]
  },
  {
    path: '/poster',
    component: Layout,
    redirect: '/poster/table',
    name: 'poster',
    meta: { title: '广告资讯', icon: 'poster' },
    children: [
      {
        path: 'banner',
        name: 'Banner',
        component: () => import('@/views/banner/index'),
        meta: { title: '轮播图', icon: 'banner' }
      },
      {
        path: 'addbanner',
        name: 'Addbanner',
        component: () => import('@/views/addbanner/index'),
        meta: { title: '添加广告', icon: 'information' }
      }
    ]
  },
  {
    path: '/equipment',
    component: Layout,
    redirect: '/equipment/table',
    name: 'equipment',
    meta: { title: '设备管理', icon: 'equipment' },
    children: [
      {
        path: 'lock',
        name: 'Lock',
        component: () => import('@/views/lock/index'),
        meta: { title: '门禁机', icon: 'personnel' }
      },
      {
        path: 'electric',
        name: 'Electric',
        component: () => import('@/views/electric/index'),
        meta: { title: '智能电表', icon: 'userinfo' }
      }
    ]
  },
  {
    path: '/about',
    component: Layout,
    redirect: '/about',
    // hidden: true,
    name: 'about',
    children: [
      {
        path: 'password',
        name: 'Password',
        component: () => import('@/views/password/index'),
        meta: { title: '修改密码', icon: 'face' }
      }
    ]
  },
  componentsRouter,

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
