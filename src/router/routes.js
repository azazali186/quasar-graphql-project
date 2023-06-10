const routes = [
  {
    name: "Page: Login",
    path: "/auth/login",
    component: () => import("src/pages/Login.vue"),
  },

  {
    path: "/",
    meta: { requiresAuth: true },
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "home",
        path: "/",
        component: () => import("src/pages/Dashboard.vue"),
        meta: { title: "Home", subtitle: "Dashboard" },
      },

      // LOG HISTORY
      {
        name: "audit-logs",
        path: "/audit-logs",
        component: () => import("src/pages/LogHistory/AuditLog.vue"),
        meta: { title: "Home", subtitle: "Activity Logs" },
      },

      // ACL
      {
        name: "roles",
        path: "/roles",
        component: () => import("pages/Role/Index.vue"),
        meta: { title: "Home", subtitle: "Roles" },
      },
      {
        name: "permissions",
        path: "/permissions",
        component: () => import("pages/Permission/Index.vue"),
        meta: { title: "Home", subtitle: "Permissions" },
      },

      // MASTER DATA
      {
        name: "languages",
        path: "/languages",
        component: () => import("pages/Language/Index.vue"),
        meta: { title: "Home", subtitle: "Languages" },
      },
      {
        name: "whitelist-ips",
        path: "/whitelist-ips",
        component: () => import("pages/WhitelistIP/Index.vue"),
        meta: { title: "Home", subtitle: "Whitelist IPs" },
      },

      // USER MANAGEMENT
      {
        name: "users",
        path: "/users",
        component: () => import("pages/User/Index.vue"),
        meta: { title: "Home", subtitle: "Users" },
      },

      // Currency MANAGEMENT
      {
        name: "currencies",
        path: "/currencies",
        component: () => import("src/pages/Currency/Index.vue"),
        meta: { title: "Home", subtitle: "Currency" },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
