import Login from '@/views/login.vue'
import Register from '@/views/register.vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
  },
  {
    path: '/admin/dashboard',
    component: () => import('@/views/admin/dashboard.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/user',
    component: () => import('@/views/admin/user.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/dataset',
    component: () => import('@/views/admin/dataset.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/permit',
    component: () => import('@/views/admin/permit.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/attendance',
    component: () => import('@/views/admin/attendance.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/notification',
    component: () => import('@/views/admin/notification.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/setting',
    component: () => import('@/views/admin/setting.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/public/dashboard',
    component: () => import('@/views/public/dashboard.vue'),
    meta: { requiresAuth: true },
  },
  

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})


router.beforeEach((to, _, next) => {
  const token = localStorage.getItem('access_token');

  if (to.meta.requiresAuth && !token) {
    next('/login');
  } else {
    next();
  }
});

export default router
