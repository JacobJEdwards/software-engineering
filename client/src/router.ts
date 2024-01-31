import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/', 
        component: () => import("./views/Home.vue")
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
