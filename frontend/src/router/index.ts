import Attendance from "@/views/attendance.vue";
import Login from "@/views/login.vue";
import Register from "@/views/register.vue";
import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

const UserRoleEnum = {
  USER: 0,
  HIRING_MANAGER: 1,
  EMPLOYEE: 2,
  INTERN: 3,
} as const;

const roleDefaultRoute: Record<number, string> = {
  [UserRoleEnum.HIRING_MANAGER]: "/admin/dashboard",
  [UserRoleEnum.EMPLOYEE]: "/public/dashboard",
  [UserRoleEnum.INTERN]: "/public/dashboard",
};

const routes: Array<RouteRecordRaw> = [
  { path: "/", redirect: "/login" },
  { path: "/login", name: "login", component: Login },
  { path: "/register", name: "register", component: Register },
  { path: "/attendance", name: "attendance", component: Attendance },

  {
    path: "/admin/dashboard",
    component: () => import("@/views/admin/dashboard.vue"),
    meta: { requiresAuth: true, roles: [UserRoleEnum.HIRING_MANAGER] },
  },
  {
    path: "/admin/user",
    component: () => import("@/views/admin/user.vue"),
    meta: { requiresAuth: true, roles: [UserRoleEnum.HIRING_MANAGER] },
  },
  {
    path: "/admin/dataset",
    component: () => import("@/views/admin/dataset.vue"),
    meta: { requiresAuth: true, roles: [UserRoleEnum.HIRING_MANAGER] },
  },
  {
    path: "/admin/permit",
    component: () => import("@/views/admin/permit.vue"),
    meta: { requiresAuth: true, roles: [UserRoleEnum.HIRING_MANAGER] },
  },
  {
    path: "/admin/attendance-history",
    component: () => import("@/views/admin/attendance-history.vue"),
    meta: { requiresAuth: true, roles: [UserRoleEnum.HIRING_MANAGER] },
  },
  {
    path: "/admin/attendance-setting",
    component: () => import("@/views/admin/attendance-setting.vue"),
    meta: { requiresAuth: true, roles: [UserRoleEnum.HIRING_MANAGER] },
  },
  {
    path: "/admin/notification",
    component: () => import("@/views/admin/notification.vue"),
    meta: { requiresAuth: true, roles: [UserRoleEnum.HIRING_MANAGER] },
  },
  {
    path: "/admin/setting",
    component: () => import("@/views/admin/setting.vue"),
    meta: { requiresAuth: true, roles: [UserRoleEnum.HIRING_MANAGER] },
  },

  {
    path: "/public/dashboard",
    component: () => import("@/views/public/dashboard.vue"),
    meta: {
      requiresAuth: true,
      roles: [UserRoleEnum.EMPLOYEE, UserRoleEnum.INTERN],
    },
  },
  {
    path: "/public/attendance",
    component: () => import("@/views/public/attendance.vue"),
    meta: {
      requiresAuth: true,
      roles: [UserRoleEnum.EMPLOYEE, UserRoleEnum.INTERN],
    },
  },
  {
    path: "/public/permit",
    component: () => import("@/views/public/permit.vue"),
    meta: {
      requiresAuth: true,
      roles: [UserRoleEnum.EMPLOYEE, UserRoleEnum.INTERN],
    },
  },
  {
    path: "/public/attendance-history",
    component: () => import("@/views/public/attendance-history.vue"),
    meta: {
      requiresAuth: true,
      roles: [UserRoleEnum.EMPLOYEE, UserRoleEnum.INTERN],
    },
  },
  {
    path: "/public/notification",
    component: () => import("@/views/public/notification.vue"),
    meta: {
      requiresAuth: true,
      roles: [UserRoleEnum.EMPLOYEE, UserRoleEnum.INTERN],
    },
  },
  {
    path: "/public/setting",
    component: () => import("@/views/public/setting.vue"),
    meta: {
      requiresAuth: true,
      roles: [UserRoleEnum.EMPLOYEE, UserRoleEnum.INTERN],
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  const token = localStorage.getItem("access_token");
  const userRole = Number(localStorage.getItem("user_role"));
  const requiredRoles = to.meta.roles as number[] | undefined;

  if (to.meta.requiresAuth && !token) {
    next("/login");
  } else if (requiredRoles && !requiredRoles.includes(userRole)) {
    next(roleDefaultRoute[userRole] ?? "/login");
  } else {
    next();
  }
});

export default router;
