import { defineStore } from "pinia";
import {
  Task,
  User,
  Milestone,
  Activity,
  Module,
  Semester,
  TaskStatuses,
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
  allActivities: Activity[];
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
    allActivities: [],
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
      this.refreshActivities();
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
      this.refreshActivities();

      this.loading = false;
    },
    refreshTasks() {
      if (!this.user) {
        return;
      }

      this.tasks = this.milestones.flatMap((m) => m.tasks);

      this.tasks = this.tasks.map((task) => {
        if (task.status === "Started") {
          task.status = TaskStatuses.NOT_STARTED;
        }

        return task;
      });
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
    refreshActivities() {
      if (!this.user) {
        return;
      }

      this.activities = this.allActivities.filter((activity) =>
        this.tasks.some((task) => task.activities.includes(activity._id)),
      );
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
      this.allActivities = result.data;
      this.loading = false;
    },
  },
});
