/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const organRouter = {
  path: '/roles',
  component: Layout,
  redirect: '/roles/table',
  name: 'roles',
  meta: { title: '角色机构账号管理', icon: 'example', roles: ['admin'] },
  children: [
    {
      path: 'table',
      name: 'Table',
      component: () => import('@/views/table/index'),
      meta: { title: '角色', icon: 'table', roles: ['admin'] }
    },
    {
      path: 'organ',
      name: 'Organ',
      component: () => import('@/views/organ/index'),
      meta: { title: '机构', icon: 'organ', roles: ['admin'] }
    },
    {
      path: 'manager',
      name: 'Manager',
      component: () => import('@/views/manager/index'),
      meta: { title: '账号', icon: 'manager', roles: ['admin'] }
    }
  ]
}

export default organRouter
