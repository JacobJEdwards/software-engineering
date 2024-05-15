<script setup lang="ts">
import UserLoading from "../components/UserLoading.vue";
import { useAuthStore, useUserStore } from "../stores";
import { computed, ref } from "vue";
import type { Task as TaskType, Activity } from "../typings/user";
import Task from "../components/Task.vue";

import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarOptions, EventInput } from "@fullcalendar/core";
import { ComputedRef } from "vue";
import SemesterOverview from "../components/SemesterOverview.vue";
import Calendar from "../components/Calendar.vue";

const userStore = useUserStore();
const authStore = useAuthStore();

const tasks = ref<TaskType[]>(userStore.tasks);
const activities = ref<Activity[]>(userStore.activities);

const topTasks: ComputedRef<TaskType[]> = computed(() =>
  tasks.value
    .filter((task) => task.status !== "Completed")
    .sort(
      (a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
    )
    .slice(0, 5),
);

const taskEvents: ComputedRef<EventInput[]> = computed(() =>
  tasks.value.map((task) => ({
    start: new Date(task.startDate),
    title: task.title,
    color: task.status === "Completed" ? "green" : "red",
  })),
);

const activityEvents: ComputedRef<EventInput[]> = computed(() =>
  activities.value.map((activity) => {
    const endDate = new Date(activity.createdAt);
    const startDate = new Date(activity.createdAt);
    startDate.setHours(startDate.getHours() - activity.hrsCompleted);

    return {
      start: startDate,
      end: endDate,
      title: activity.activityTitle,
      color: "pink",
    };
  }),
);

const events = computed(() => [...taskEvents.value, ...activityEvents.value]);

const calendarOptions = ref<CalendarOptions>({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  headerToolbar: {
    left: "prev,next",
    center: "title",
    right: "today",
  },
  editable: false,
  selectable: false,
  selectMirror: false,
  dayMaxEvents: true,
  weekends: true,
  events: events.value,
});

userStore.$subscribe(() => {
  tasks.value = userStore.tasks;
  activities.value = userStore.activities;
  calendarOptions.value.events = events.value;
});
</script>

<template>
  <v-container>
    <UserLoading v-if="userStore.loading" />

    <v-row v-else>
      <v-col cols="12" md="6">
        <v-card rounded="md" elevation="3">
          <v-card-title class="card-title">
            <v-icon>mdi-checkbox-marked-circle-outline</v-icon
            ><span> Upcoming Tasks</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text v-if="topTasks.length" class="bg-grey">
            <v-list>
              <Task
                v-for="task in topTasks"
                :task="task"
                :key="task._id"
                editable
              />
            </v-list>
          </v-card-text>
          <v-card-text v-else>
            <p class="text-lg mb-4">No tasks due soon!</p>
            <p class="text-sm text-gray-400">
              Create a task in the
              <router-link
                to="/tasks"
                class="text-blue-500 text-sm hover:text-blue-700 focus:outline-none"
                >task page.</router-link
              >
            </p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-row>
          <v-col cols="12">
            <v-card rounded="md" elevation="3">
              <v-card-title class="card-title">
                <v-icon class="">mdi-clock-time-four-outline</v-icon
                ><span> Semester Overview</span>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <SemesterOverview
                  v-if="userStore.currentSemester"
                  :selected-semester="userStore.currentSemester"
                />
                <div class="p-4" v-else>
                  <p class="text-lg">No semester found!</p>
                  <div class="my-4">
                    <v-divider class="my-4"></v-divider>
                  </div>
                  <router-link
                    to="/profile"
                    class="text-blue-500 text-sm hover:text-blue-700 focus:outline-none"
                    >Upload a semester</router-link
                  >
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card rounded="md" elevation="3">
              <v-card-title class="card-title">
                <v-icon>mdi-calendar</v-icon><span> Calendar</span>
              </v-card-title>

              <v-divider></v-divider>
              <Calendar dueDatesOnly />
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped></style>
