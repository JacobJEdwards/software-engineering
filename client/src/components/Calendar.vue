<script setup lang="ts">
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarOptions } from "@fullcalendar/core";

import { ref, computed, ComputedRef } from "vue";
import { useUserStore } from "../stores";
import { EventInput } from "fullcalendar";
import CreateTask from "./modals/CreateTask.vue";
import { Task, Activity } from "../typings/user.ts";

const userStore = useUserStore();
const addTask = ref<boolean>(false);

const tasks = ref<Task[]>(userStore.tasks);
const activities = ref<Activity[]>(userStore.activities);

const taskEvents: ComputedRef<EventInput[]> = computed(() =>
  tasks.value.map((task) => {
    const startDate = new Date(task.startDate);
    const endDate = new Date(task.endDate);

    return {
      start: startDate,
      end: endDate,
      allDay: true,
      title: task.title,
      color: task.status === "Completed" ? "green" : "red",
      id: task._id,
      extendedProps: {
        task: task,
      },
    };
  }),
);

// activites marked with a green tick on the calendar
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
      id: activity._id,
      extendedProps: {
        activity: activity,
      },
    };
  }),
);

const events = computed(() => taskEvents.value.concat(activityEvents.value));

const calendarOptions = ref<CalendarOptions>({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay",
  },
  initialView: "dayGridMonth",
  events: events.value,
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  eventClick: (event) => {
    const task = event.event._def.extendedProps.task;
    console.log(task);
  },
  select: (info) => {
    console.log(info);
  },
  dateClick(arg) {
    addTask.value = true;
  },
});

const updateEvents = () => {
  console.log(events.value);
  tasks.value = userStore.tasks;
  activities.value = userStore.activities;
  calendarOptions.value.events = events.value;
};

const calendar = ref<typeof FullCalendar | null>(null);
</script>

<template>
  <v-container>
    <FullCalendar :options="calendarOptions" />
    <CreateTask
      :visible="addTask"
      :close="() => (addTask = false)"
      @created="updateEvents"
    />
  </v-container>
</template>

<style scoped></style>
