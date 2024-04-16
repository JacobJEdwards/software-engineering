import { defineStore } from 'pinia'
import { API_ROUTE } from '../config.ts'
import type { User } from '../typings/user.ts'
import { useAuthStore } from "./auth.ts";

export type UserState = {
    userId: string | null;
    user: User | null;
    loading: boolean
}

export const useUserStore = defineStore("user", {
    state: (): UserState => ({
        userId: null,
        user: null,
        loading: false
    }),
    getters: {
        userInfo: state => state.user,
        isLoading: state => state.loading
    },
    actions: {
        async getUser() {
            const authStore = useAuthStore()

            if (!authStore.isLoggedIn) {
                return;
            }

            const token = authStore.authToken

            if (!token) {
                return
            }

            try {
                this.loading = true;
                const response = await fetch(`${API_ROUTE}/protected/home`, {
                    headers: {
                        Authorization: token
                    }
                })

                if (!response.ok) {
                    throw new Error('Error getting profile')
                }

                const json = await response.json();

                this.user = json.data;
            } catch (e) {
                console.error(e)
                authStore.logout()
            } finally {
                this.loading = false;
            }
        }
    },
})