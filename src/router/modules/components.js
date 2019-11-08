/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const componentsRouter = {
  path: '/components',
  component: Layout,
  redirect: 'noRedirect',
  name: 'ComponentDemo',
  hidden: true,
  meta: {
    title: 'Components',
    icon: 'component',
    roles: ['admin']
  },
  children: [
    {
      path: 'drag-dialog',
      component: () => import('@/views/components-demo/drag-dialog'),
      name: 'DragDialogDemo',
      meta: { title: '测试', roles: ['admin'] }
    }
  ]
}

export default componentsRouter
