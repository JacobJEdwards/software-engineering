import {defineStore} from 'pinia'
import {API_ROUTE} from '../config.ts'
import type {User} from '../typings/user.ts'
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
        const response = await fetch(`${API_ROUTE}/protected/??`, {
          headers: {
            Authorization: token
          }
        })

        if (!response.ok) {
          throw new Error('Error getting profile')
        }

        this.user = await response.json();
      } catch (e) {
        console.error(e)
      } finally {
        this.loading = false;
      }
    }
  },
})

// Export the store instance
export default useUserStore