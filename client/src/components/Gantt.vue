<script setup lang="ts">
import { ref } from "vue";
// full calender gantt
import FullCalendar from "@fullcalendar/vue3";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import { CalendarOptions } from "@fullcalendar/core";
import { useUserStore } from "../stores";
import TaskInfo from "./modals/TaskInfo.vue";

const userStore = useUserStore();

const taskInfo = ref({
  show: false,
  task: null,
});

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

const calenderOptions = ref<CalendarOptions>({
  plugins: [resourceTimelinePlugin],
  initialView: "resourceTimelineMonth",
  headerToolbar: {
    left: "prev,next",
    center: "title",
    right: "resourceTimelineMonth,resourceTimelineDay",
  },
  resources: resources,
  events: events,
  schedulerLicenseKey: "CC-Attribution-NonCommercial-NoDerivatives",
  eventClick(arg) {
    const task = arg.event.extendedProps.task;
    taskInfo.value = {
      show: true,
      task: task,
    };
  },
});
</script>

<template>
  <v-container>
    <FullCalendar :options="calenderOptions" />
  </v-container>
  <TaskInfo
    v-if="taskInfo.task"
    v-model:show="taskInfo.show"
    :task="taskInfo.task"
    editable
    :close="() => (taskInfo.show = false)"
  />
</template>

<style>
.fc-timeline-event {
  cursor: pointer;
}

.fc-timeline-event:hover {
  filter: brightness(90%);
}
</style>
