import { createRouter, createWebHistory } from 'vue-router'

const routes = [
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
    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes
})

const isAuth = () => {
    return $cookies.get("auth");
}

router.beforeEach((to, from) => {
    if (!isAuth() && to.name !== "login") {
        return { name: "login" }
    }
})

router.onError(err => {
    console.error(err)
    router.push("/")
})
