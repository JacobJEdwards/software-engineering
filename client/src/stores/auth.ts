import { defineStore } from "pinia";

export type AuthState = {
  token?: string;
  email?: string;
};

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    token: undefined,
    email: undefined,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
    authToken: (state) => state.token ?? "",
  },
  actions: {
    login(token: string) {
      this.token = token;
    },
    logout() {
      this.token = "";
    },
  },
  persist: true,
});
