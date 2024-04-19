import { defineStore } from "pinia";
import type { Task, User, Milestone } from "../typings/user.ts";
import { useAuthStore } from "./auth.ts";
import { getUser } from "../services/user.ts";

export type UserState = {
  userId: string | null;
  user: User | null;
  loading: boolean;
  tasks: Task[];
  milestones: Milestone[];
};

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    userId: null,
    user: null,
    loading: false,
    tasks: [],
    milestones: [],
  }),
  getters: {
    userInfo: (state) => state.user,
    isLoading: (state) => state.loading,
  },
  actions: {
    async getUser() {
      const authStore = useAuthStore();

      if (!authStore.isLoggedIn) {
        return;
      }

      const token = authStore.authToken;

      if (!token) {
        return;
      }

      this.loading = true;

      const result = await getUser(token);
      if (!result.success || !result.data) {
        this.loading = false;
        authStore.logout();
        return;
      }

      this.user = result.data;
      this.refreshTasks();

      this.loading = false;
    },
    refreshTasks() {
      if (!this.user) {
        return;
      }

      this.milestones = this.user.semester.flatMap((s) =>
        s.modules.flatMap((m) => m.milestones.flatMap((m) => m)),
      );

      this.tasks = this.milestones.flatMap((m) => m.tasks);
    },
  },
});
