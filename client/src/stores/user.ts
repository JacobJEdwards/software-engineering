import { defineStore } from "pinia";
import type {
  Task,
  User,
  Milestone,
  Activity,
  Module,
  Semester,
} from "../typings/user.ts";
import { useAuthStore } from "./auth.ts";
import { getUser } from "../services/user.ts";
import { getActivities } from "../services/activities";

export type UserState = {
  userId: string | null;
  user: User | null;
  currentSemester: Semester | null;
  loading: boolean;
  tasks: Task[];
  milestones: Milestone[];
  activities: Activity[];
  modules: Module[];
};

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    userId: null,
    user: null,
    currentSemester: null,
    loading: false,
    tasks: [],
    milestones: [],
    modules: [],
    activities: [],
  }),
  getters: {
    userInfo: (state) => state.user,
    isLoading: (state) => state.loading,
  },
  actions: {
    changeSemester(semester: Semester | null) {
      if (!semester) {
        return;
      }

      this.currentSemester = semester;
      this.refreshModules();
      this.refreshMilestones();
      this.refreshTasks();
    },
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
      this.userId = result.data._id;

      this.currentSemester = this.user.semester.length
        ? this.user.semester[0]
        : null;

      await this.loadActivities();
      this.refreshModules();
      this.refreshMilestones();
      this.refreshTasks();

      this.loading = false;
    },
    refreshTasks() {
      if (!this.user) {
        return;
      }

      this.tasks = this.milestones.flatMap((m) => m.tasks);
    },
    refreshModules() {
      if (!this.user) {
        return;
      }

      this.modules = this.currentSemester?.modules ?? [];
    },
    refreshMilestones() {
      if (!this.user) {
        return;
      }

      this.milestones = this.modules.flatMap((m) => m.milestones);
    },
    async loadActivities() {
      if (!this.user) {
        return;
      }

      const authStore = useAuthStore();

      if (!authStore.isLoggedIn) {
        return;
      }
      const token = authStore.authToken;

      if (!token) {
        return;
      }

      this.loading = true;

      const result = await getActivities(token);

      if (!result.success || !result.data) {
        this.loading = false;
        return;
      }
      this.activities = result.data;
      this.loading = false;
    },
  },
});
