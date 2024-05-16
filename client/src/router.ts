import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  Router,
} from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: () => import("./views/Home.vue"),
    meta: {
      requiresAuth: true,
      title: "Dashboard",
    },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("./views/Login.vue"),
    meta: {
      requiresAuth: false,
      title: "Login",
    },
  },
  {
    path: "/verify",
    name: "verify",
    component: () => import("./views/Verify.vue"),
    meta: {
      requiresAuth: false,
      title: "Verify Email",
    },
  },
  {
    path: "/schedule",
    name: "schedule",
    component: () => import("./views/Schedule.vue"),
    meta: {
      requiresAuth: true,
      title: "Schedule",
    },
  },
  {
    path: "/signup",
    name: "signup",
    component: () => import("./views/Signup.vue"),
    meta: {
      requiresAuth: false,
      title: "Signup",
    },
  },
  {
    path: "/tasks",
    name: "tasks",
    component: () => import("./views/Tasks.vue"),
    meta: {
      requiresAuth: true,
      title: "Tasks",
    },
  },
  {
    path: "/profile",
    name: "profile",
    component: () => import("./views/Profile.vue"),
    meta: {
      requiresAuth: true,
      title: "Profile",
    },
  },
  {
    path: "/milestones",
    name: "milestones",
    component: () => import("./views/Milestones.vue"),
    meta: {
      requiresAuth: true,
      title: "Milestones",
    },
  },
  {
    path: "/modules",
    name: "modules",
    component: () => import("./views/Modules.vue"),
    meta: {
      requiresAuth: true,
      title: "Modules",
    },
  },
  {
    path: "/stats",
    name: "stats",
    component: () => import("./views/Stats.vue"),
    meta: {
      requiresAuth: true,
      title: "Stats",
    },
  },
  {
    path: "/privacy",
    name: "privacy",
    component: () => import("./views/Privacy.vue"),
    meta: {
      requiresAuth: false,
      title: "Privacy Policy",
    },
  },
  {
    path: "/terms",
    name: "terms",
    component: () => import("./views/Terms.vue"),
    meta: {
      requiresAuth: false,
      title: "Terms & Conditions",
    },
  },
  {
    path: "/about",
    name: "about",
    component: () => import("./views/About.vue"),
    meta: {
      requiresAuth: false,
      title: "About Us",
    },
  },
  {
    path: "/contact",
    name: "contact",
    component: () => import("./views/Contact.vue"),
    meta: {
      requiresAuth: false,
      title: "Contact Us",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("./views/NotFound.vue"),
    meta: {
      requiresAuth: false,
      title: "",
    },
  },
];

export const router: Router = createRouter({
  history: createWebHistory(),
  routes,
});

router.onError(async (err) => {
  console.error(err);
  await router.push("home");
});
