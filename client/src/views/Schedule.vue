<script setup lang="ts">
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarOptions } from "@fullcalendar/core";

import { ref } from "vue";
import { useUserStore} from "../stores";

const userStore = useUserStore()

const tasks = userStore.tasks

const events = tasks.map((task) => {
  const startDate = new Date(task.startDate)
  const endDate = new Date(task.endDate)

  return {
    start: startDate,
    end: endDate,
    allDay: true,
    title: task.title,
    color: task.status === "Completed" ? "green" : "red",
  }
})

const calendarOptions = ref<CalendarOptions>({
  plugins: [
    dayGridPlugin,
    timeGridPlugin,
    interactionPlugin,
  ],
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay",
  },
  initialView: "dayGridMonth",
  events: events,
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
});



</script>

<template>
  <v-container>
    <FullCalendar :options="calendarOptions" />
  </v-container>
</template>