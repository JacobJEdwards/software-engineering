<script setup lang="ts">
import { computed, ref } from "vue";
import { useUserStore } from "../stores";
import {
  Task,
  Module,
  Milestone,
  Activity,
  TaskStatuses,
} from "../typings/user.ts";

const userStore = useUserStore();
const tasks = ref<Task[]>(userStore.tasks);
const modules = ref<Module[]>(userStore.modules);
const milestones = ref<Milestone[]>(userStore.milestones);
const activities = ref<Activity[]>(userStore.activities);

const getTask = (id: string) => tasks.value.find((task) => task._id === id);

const totalHours = computed(() => {
  return activities.value.reduce(
    (acc, activity) => acc + activity.hrsCompleted,
    0,
  );
});

const totalTasks = computed(() => tasks.value.length);

const totalCompletedTasks = computed(
  () =>
    tasks.value.filter((task) => task.status === TaskStatuses.COMPLETED).length,
);

const totalModules = computed(() => modules.value.length);

const totalMilestones = computed(() => milestones.value.length);

const totalActivities = computed(() => activities.value.length);

const mostHoursSpent = computed(() => {
  let bestActivity = activities.value.length > 0 ? activities.value[0] : null;

  if (!bestActivity) {
    return null;
  }

  activities.value.forEach((activity) => {
    if (activity.hrsCompleted > bestActivity.hrsCompleted) {
      bestActivity = activity;
    }
  });

  return bestActivity?.hrsCompleted;
});

const mostTasksCompletedMilestone = computed(() => {
  let bestMilestone = milestones.value.length > 0 ? milestones.value[0] : null;
  if (!bestMilestone) {
    return null;
  }

  milestones.value.forEach((milestone) => {
    const numTasksCompleted = milestone.tasks.filter(
      (task) => task.status === TaskStatuses.COMPLETED,
    ).length;

    if (
      numTasksCompleted >
      bestMilestone.tasks.filter(
        (task) => task.status === TaskStatuses.COMPLETED,
      ).length
    ) {
      bestMilestone = milestone;
    }
  });
  return bestMilestone;
});
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-card rounded="md" elevation="3">
          <v-card-title class="card-title">
            <v-icon color="primary">mdi-clock-time-four-outline</v-icon>
            Total Hours Logged
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="text-center d-flex align-center justify-center">
            <p class="text-lg">{{ totalHours }}</p>
          </v-card-text>
        </v-card>

        <v-card rounded="md" elevation="3" class="mt-4">
          <v-card-title class="card-title">
            <v-icon color="primary">mdi-format-list-checks</v-icon>
            Total Tasks
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="text-center d-flex align-center justify-center">
            <p class="text-lg">{{ totalTasks }}</p>
          </v-card-text>
        </v-card>

        <v-card rounded="md" elevation="3" class="mt-4">
          <v-card-title class="card-title">
            <v-icon color="primary">mdi-check-circle-outline</v-icon>
            Total Completed Tasks
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="text-center d-flex align-center justify-center">
            <p class="text-lg">{{ totalCompletedTasks }}</p>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card rounded="md" elevation="3">
          <v-card-title class="card-title">
            <v-icon color="primary">mdi-folder-multiple-outline</v-icon>
            Total Modules
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="text-center d-flex align-center justify-center">
            <p class="text-lg">{{ totalModules }}</p>
          </v-card-text>
        </v-card>

        <v-card rounded="md" elevation="3" class="mt-4">
          <v-card-title class="card-title">
            <v-icon color="primary">mdi-flag-checkered</v-icon>
            Total Milestones
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="text-center d-flex align-center justify-center">
            <p class="text-lg">{{ totalMilestones }}</p>
          </v-card-text>
        </v-card>

        <v-card rounded="md" elevation="3" class="mt-4">
          <v-card-title class="card-title">
            <v-icon color="primary">mdi-run-fast</v-icon>
            Total Activities
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="text-center d-flex align-center justify-center">
            <p class="text-lg text-center">{{ totalActivities }}</p>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12">
        <v-card rounded="md" elevation="3" class="mt-4" v-if="mostHoursSpent">
          <v-card-title class="card-title">
            <v-icon color="primary">mdi-timer-sand</v-icon>
            Most Hours Spent on an Activity
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="text-center d-flex align-center justify-center">
            <p class="text-lg text-center">{{ mostHoursSpent }}</p>
          </v-card-text>
        </v-card>

        <v-card rounded="md" elevation="3" class="mt-4">
          <v-card-title class="card-title">
            <v-icon color="primary">mdi-trophy-outline</v-icon>
            Milestone with Most Completed Tasks
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <p class="text-lg">
              {{ mostTasksCompletedMilestone?.milestoneTitle }}
            </p>
            <p class="text-sm">
              {{ mostTasksCompletedMilestone?.tasks.length }} tasks!
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped></style>
