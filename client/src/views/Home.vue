<script setup lang="ts">
import UserLoading from "../components/UserLoading.vue";
import { useUserStore } from "../stores";
import Semester from "../components/Semester.vue";
import { computed, ref } from "vue";
import type { Task as TaskType, Activity } from "../typings/user";
import Task from "../components/Task.vue";

import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarOptions, EventInput } from "@fullcalendar/core";
import { ComputedRef } from "vue";

const userStore = useUserStore();

const tasks = ref<TaskType[]>(userStore.tasks);
const activities = ref<Activity[]>(userStore.activities);

const topTasks: ComputedRef<TaskType[]> = computed(() =>
  tasks.value.filter((task) => task.status !== "Completed").slice(0, 5),
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
});
</script>

<template>
  <v-container>
    <UserLoading v-if="userStore.loading" />

    <v-row v-else>
      <v-col cols="12" md="6">
        <v-card
          title="Upcoming Tasks"
          prepend-icon="mdi-checkbox-marked-circle-outline"
        >
          <v-divider></v-divider>
          <v-card-text v-if="topTasks.length">
            <v-list>
              <Task v-for="task in topTasks" :task="task" :key="task._id" />
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
            <v-card
              title="Current Semester"
              prepend-icon="mdi-clipboard-outline"
            >
              <v-divider></v-divider>
              <v-card-text>
                <Semester
                  v-if="userStore.user?.semester?.length"
                  :semester="userStore.user?.semester[0]"
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
            <v-card title="Calendar" prepend-icon="mdi-calendar">
              <v-divider></v-divider>
              <v-card-text>
                <FullCalendar :options="calendarOptions" class="fc" />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped></style>
