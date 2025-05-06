import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/layout/index.vue'),
    redirect: '/login',
    children: [
      {
        path: 'class',
        component: () => import('@/views/class/main/ClassManage.vue'),
      },
      {
        path: 'student',
        component: () => import('@/views/class/main/StudentManage.vue'),
      },
      {
        path: 'department',
        component: () => import('@/views/system/main/Department.vue'),
      },
      {
        path: 'staff',
        component: () => import('@/views/system/main/Worker.vue'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@/views/login/login.vue'),
  },
  {
    path: '/register',
    component: () => import('@/views/login/register.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
