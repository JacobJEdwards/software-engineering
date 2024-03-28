import { createRouter, createWebHistory, RouteRecordRaw, Router } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: "home",
        component: () => import("./views/Home.vue"),
        meta: {
            requiresAuth: true,
            title: "Dashboard"
        }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import("./views/Login.vue"),
        meta: {
            requiresAuth: false,
            title: "Login",
        }
    },
    {
        path: "/schedule",
        name: 'schedule',
        component: () => import("./views/Schedule.vue"),
        meta: {
            requiresAuth: true,
            title: "Schedule"
        }
    },
    {
        path: "/signup",
        name: 'signup',
        component: () => import("./views/Signup.vue"),
        meta: {
            requiresAuth: false,
            title: "Signup"
        }
    },
    {
        path: "/tasks",
        name: 'tasks',
        component: () => import("./views/Tasks.vue"),
        meta: {
            requiresAuth: true,
            title: "Tasks"
        }
    },
    {
        path: "/profile",
        name: "profile",
        component: () => import("./views/Profile.vue"),
        meta: {
            requiresAuth: true,
            title: "Profile"
        }
    }
]

export const router: Router = createRouter({
    history: createWebHistory(),
    routes
})

router.onError(async (err) => {
    console.error(err)
    await router.push("/")
})
