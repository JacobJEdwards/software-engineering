<script setup lang="ts">
import { ref } from "vue";
// full calender gantt
import FullCalendar from "@fullcalendar/vue3";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import { CalendarOptions } from "@fullcalendar/core";
import { useUserStore } from "../stores";

const userStore = useUserStore();

const tasks = userStore.tasks;
const milestones = userStore.milestones;

const resources = milestones.map((milestone) => {
  return {
    id: milestone._id,
    title: milestone.milestoneTitle,
  };
});

const events = milestones
  .map((milestone) => {
    const milestoneId = milestone._id;

    return milestone.tasks.map((task) => {
      const startDate = new Date(task.startDate);
      const endDate = new Date(task.endDate);

      return {
        start: startDate,
        end: endDate,
        allDay: true,
        title: task.title,
        color: task.status === "Completed" ? "green" : "red",
        id: task._id,
        resourceId: milestoneId,
        extendedProps: {
          task: task,
        },
      };
    });
  })
  .flat();

console.log(events);

const calenderOptions = ref<CalendarOptions>({
  plugins: [resourceTimelinePlugin],
  initialView: "resourceTimeline",
  headerToolbar: {
    left: "prev,next",
    center: "title",
    right: "resourceTimelineMonth,resourceTimelineWeek,resourceTimelineDay",
  },
  resources: resources,
  events: events,
  schedulerLicenseKey: "CC-Attribution-NonCommercial-NoDerivatives",
});
</script>

<template>
  <v-container>
    <FullCalendar :options="calenderOptions" />
  </v-container>
</template>

<style scoped></style>
