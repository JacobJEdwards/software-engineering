import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: "Home",
        component: () => import("./views/Home.vue")
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import("./views/Login.vue")
    },
    {
        path: "/schedule",
        name: 'Schedule',
        component: () => import("./views/Schedule.vue")
    }
]

export const router = createRouter({
    history: createWebHistory(),
    routes
})

const isAuth = true

router.beforeEach(async (to, from) => {
    if (!isAuth && to.name !== "Login") {
        return { name: "Login" }
    }
})

router.onError(err => {
    console.error(err)
    router.push("/")
})
