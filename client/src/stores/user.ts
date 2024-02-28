import {defineStore} from 'pinia'
import {API_ROUTE} from '../config.ts'
import type {User} from '../typings/user.ts'
import { useAuthStore } from "./auth.ts";

export type UserState = {
    userId: string | null;
    user: User | null;
}

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    userId: null,
    user: null
  }),
  getters: {
    userInfo: state => state.user,
  },
  actions: {
    async getUser() {
      const authStore = useAuthStore()

      if (!authStore.isLoggedIn) {
        return;
      }

      try {
        const response = await fetch(`${API_ROUTE}/protected/??`, {
          headers: {
            Authorization: authStore.token
          }
        })

        if (!response.ok) {
          throw new Error('Error getting profile')
        }

        this.user = await response.json();
      } catch (e) {
        console.error(e)
      }
    }
  },
})

// Export the store instance
export default useUserStore
