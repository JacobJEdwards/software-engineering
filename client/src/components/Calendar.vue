<script setup lang="ts">
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarOptions } from "@fullcalendar/core";

import TaskInfo from "./modals/TaskInfo.vue";
import ActivityInfo from "./modals/ActivityInfo.vue";

import { ref, computed, ComputedRef } from "vue";
import { useUserStore } from "../stores";
import { EventInput } from "fullcalendar";
import CreateTask from "./modals/CreateTask.vue";
import { Task, Activity } from "../typings/user.ts";

const userStore = useUserStore();

const addTask = ref<boolean>(false);

const tasks = ref<Task[]>(userStore.tasks);
const activities = ref<Activity[]>(userStore.activities);
const showOptions = ref<boolean>(false);

const selectedStartDate = ref<Date | undefined>(undefined);
const selectedEndDate = ref<Date | undefined>(undefined);

const taskInfo = ref<{
  show: boolean;
  task?: Task;
}>({
  show: false,
});

const activityInfo = ref<{
  show: boolean;
  activity?: Activity;
}>({
  show: false,
});

const EventTypes = {
  ACTIVITY: "ACTIVITY",
  TASK: "TASK",
} as const;

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
        type: EventTypes.TASK,
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
        type: EventTypes.ACTIVITY,
      },
    };
  }),
);

const events = computed(() => [...taskEvents.value, ...activityEvents.value]);

const calendarOptions = ref<CalendarOptions>({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay",
  },
  initialView: "dayGridMonth",
  events: events.value,
  editable: false,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  eventClick: (event) => {
    switch (event.event._def.extendedProps.type) {
      case EventTypes.TASK:
        taskInfo.value.task = event.event._def.extendedProps.task;
        taskInfo.value.show = true;
        break;
      case EventTypes.ACTIVITY:
        activityInfo.value.activity = event.event._def.extendedProps.activity;
        activityInfo.value.show = true;
        break;
    }
  },
  select: (info) => {
    selectedStartDate.value = new Date(info.startStr);
    selectedEndDate.value = new Date(info.end);
    selectedEndDate.value.setDate(selectedEndDate.value.getDate() - 1);

    addTask.value = true;
  },
  dateClick(arg) {
    selectedStartDate.value = new Date(arg.dateStr);
    selectedEndDate.value = undefined;
    addTask.value = true;
  },
});

const updateEvents = () => {
  tasks.value = userStore.tasks;
  activities.value = userStore.activities;
  calendarOptions.value.events = events.value;
};

const calendar = ref<typeof FullCalendar | null>(null);

userStore.$subscribe(updateEvents);
</script>

<template>
  <v-container>
    <v-row>
      <v-col :cols="showOptions ? 9 : 12">
        <FullCalendar :options="calendarOptions" />
      </v-col>
      <v-col cols="3" v-if="showOptions">
        <v-card> </v-card>
      </v-col>
    </v-row>
  </v-container>
  <CreateTask
    v-model:show="addTask"
    :close="() => (addTask = false)"
    :start-date="selectedStartDate"
    :end-date="selectedEndDate"
  />
  <TaskInfo
    v-if="taskInfo.task"
    v-model:show="taskInfo.show"
    :task="taskInfo.task"
    :close="() => (taskInfo.show = false)"
    editable
  />
  <ActivityInfo
    v-if="activityInfo.activity"
    v-model:show="activityInfo.show"
    :activity="activityInfo.activity"
    :close="() => (activityInfo.show = false)"
    editable
  />
</template>

<style>
.fc-daygrid-event {
  cursor: pointer;
}

.fc-daygrid-event:hover {
  filter: brightness(90%);
}
</style>
