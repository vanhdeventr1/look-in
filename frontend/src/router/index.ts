import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Login from '@/views/Login.vue'
import Register from '../views/Register.vue'

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
    path: '/dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true },
  }

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
