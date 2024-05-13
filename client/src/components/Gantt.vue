<script setup lang="ts">
import { computed, ComputedRef, ref } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import { CalendarOptions } from "@fullcalendar/core";
import { useUserStore } from "../stores";
import TaskInfo from "./modals/TaskInfo.vue";
import { Milestone, Task } from "../typings/user.ts";
import { EventInput } from "@fullcalendar/core";

const userStore = useUserStore();

type Resource = {
  id: string;
  title: string;
};

const taskInfo = ref<{
  show: boolean;
  task: Task | null;
}>({
  show: false,
  task: null,
});

const milestones = ref<Milestone[]>(userStore.milestones);

const resources: ComputedRef<Resource[]> = computed(() =>
  milestones.value.map((milestone) => ({
    id: milestone._id,
    title: milestone.milestoneTitle,
  })),
);

const events: ComputedRef<EventInput[]> = computed(() =>
  milestones.value.flatMap((milestone) =>
    milestone.tasks.flatMap((task) => ({
      start: new Date(task.startDate),
      end: new Date(task.endDate),
      allDay: true,
      title: task.title,
      color: task.status === "Completed" ? "green" : "red",
      id: task._id,
      resourceId: milestone._id,
      extendedProps: {
        task: task,
      },
    })),
  ),
);

const calenderOptions = ref<CalendarOptions>({
  plugins: [resourceTimelinePlugin],
  initialView: "resourceTimelineMonth",
  headerToolbar: {
    left: "prev,next",
    center: "title",
    right: "resourceTimelineMonth,resourceTimelineDay",
  },
  resources: resources.value,
  events: events.value,
  schedulerLicenseKey: "CC-Attribution-NonCommercial-NoDerivatives",
  eventClick(arg) {
    const task = arg.event.extendedProps.task;
    taskInfo.value = {
      show: true,
      task: task,
    };
  },
});

userStore.$subscribe(() => {
  milestones.value = userStore.milestones;
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
