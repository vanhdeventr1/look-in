import Login from "@/views/login.vue";
import Register from "@/views/register.vue";
import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

const routes: Array<RouteRecordRaw> = [
  { path: "/", redirect: "/login" },
  { path: "/login", name: "login", component: Login },
  { path: "/register", name: "register", component: Register },

  {
    path: "/admin/dashboard",
    component: () => import("@/views/admin/dashboard.vue"),
    meta: { requiresAuth: true, role: 1 },
  },
  {
    path: "/admin/user",
    component: () => import("@/views/admin/user.vue"),
    meta: { requiresAuth: true, role: 1 },
  },
  {
    path: "/admin/dataset",
    component: () => import("@/views/admin/dataset.vue"),
    meta: { requiresAuth: true, role: 1 },
  },
  {
    path: "/admin/permit",
    component: () => import("@/views/admin/permit.vue"),
    meta: { requiresAuth: true, role: 1 },
  },
  {
    path: "/admin/attendance",
    component: () => import("@/views/admin/attendance.vue"),
    meta: { requiresAuth: true, role: 1 },
  },
  {
    path: "/admin/notification",
    component: () => import("@/views/admin/notification.vue"),
    meta: { requiresAuth: true, role: 1 },
  },
  {
    path: "/admin/setting",
    component: () => import("@/views/admin/setting.vue"),
    meta: { requiresAuth: true, role: 1 },
  },

  {
    path: "/public/dashboard",
    component: () => import("@/views/public/dashboard.vue"),
    meta: { requiresAuth: true, role: 2 },
  },
  {
    path: "/public/permit",
    component: () => import("@/views/public/permit.vue"),
    meta: { requiresAuth: true, role: 2 },
  },
  {
    path: "/public/notification",
    component: () => import("@/views/public/notification.vue"),
    meta: { requiresAuth: true, role: 2 },
  },
  {
    path: "/public/setting",
    component: () => import("@/views/public/setting.vue"),
    meta: { requiresAuth: true, role: 2 },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  const token = localStorage.getItem("access_token");
  const userRole = Number(localStorage.getItem("user_role"));

  if (to.meta.requiresAuth && !token) {
    next("/login");
  } else if (to.meta.role && to.meta.role !== userRole) {
    next(userRole === 1 ? "/admin/dashboard" : "/public/dashboard");
  } else {
    next();
  }
});

export default router;
