import { createRouter, createWebHistory, RouteRecordRaw, Router } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: "home",
        component: () => import("./views/Home.vue")
    },
    {
        path: '/login',
        name: 'login',
        component: () => import("./views/Login.vue")
    },
    {
        path: "/schedule",
        name: 'schedule',
        component: () => import("./views/Schedule.vue")
    },
    {
        path: "/signup",
        name: 'signup',
        component: () => import("./views/Signup.vue")
    },
    {
        path: "/tasks",
        name: 'tasks',
        component: () => import("./views/Tasks.vue")
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
