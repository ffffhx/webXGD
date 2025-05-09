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
    name: 'Login',
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

router.beforeEach(async (to, from) => {
  if (
    // 检查用户是否已登录
    !localStorage.getItem('token') &&
    // ❗️ 避免无限重定向
    to.name !== 'Login'
  ) {
    // 将用户重定向到登录页面
    return { name: 'Login' }
  }
})

export default router
