import {defineStore} from 'pinia'
import {useCookies} from '../utils/utils.ts'

export type AuthState = {
    token: string
}

const $cookies = useCookies()

export const useAuthStore = defineStore("auth", {
    state: (): AuthState => ({
        token: $cookies?.get("auth")
    }),
    getters: {
        isLoggedIn: state => !!state.token
    },
    actions: {
        login(token: string) {
            $cookies?.set("auth", token)
            this.token = token
        },
        logout() {
            $cookies?.remove("auth")
            this.token = ""
        }
    }
})

