<script setup lang="ts">
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { CalendarOptions } from "@fullcalendar/core";

import TaskInfo from "./modals/TaskInfo.vue";
import ActivityInfo from "./modals/ActivityInfo.vue";
import ModuleInfo from "./modals/ModuleInfo.vue";
import MilestoneInfo from "./modals/MilestoneInfo.vue";

import { ref, computed, ComputedRef } from "vue";
import { useAuthStore, useUserStore } from "../stores";
import { EventInput } from "fullcalendar";
import CreateTask from "./modals/CreateTask.vue";
import { Task, Activity, Milestone, Module } from "../typings/user.ts";
import Alert from "./utils/Alert.vue";
import { useSuccessErrorMessage } from "../utils/utils.ts";
import { TaskService } from "../services/tasks";

const props = defineProps({
  dueDatesOnly: {
    type: Boolean,
    default: false,
  },
});

const { success, error } = useSuccessErrorMessage();

const userStore = useUserStore();
const authStore = useAuthStore();

const addTask = ref<boolean>(false);

const tasks = ref<Task[]>(userStore.tasks);
const activities = ref<Activity[]>(userStore.activities);
const milestones = ref<Milestone[]>(userStore.milestones);
const modules = ref<Module[]>(userStore.modules);

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

const milestoneInfo = ref<{
  show: boolean;
  milestone?: Milestone;
}>({
  show: false,
});

const moduleInfo = ref<{
  show: boolean;
  module?: Module;
}>({
  show: false,
});

const updateTask = async (task: Task) => {
  try {
    success.value.message = "Task updated successfully";
    success.value.show = true;
  } catch (e: any) {
    error.value.message = e?.message ?? "Error updating task";
    error.value.show = true;
  }
};

const EventTypes = {
  ACTIVITY: "ACTIVITY",
  TASK: "TASK",
  MILESTONE: "MILESTONE",
  MODULE: "MODULE",
} as const;

const taskEvents: ComputedRef<EventInput[]> = computed(() =>
  tasks.value.map((task) => {
    const startDate = new Date(task.startDate);
    const endDate = new Date(task.endDate);

    return {
      start: props.dueDatesOnly ? endDate : startDate,
      end: props.dueDatesOnly ? undefined : endDate,
      allDay: !props.dueDatesOnly,
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

const milestonesEvents: ComputedRef<EventInput[]> = computed(() =>
  milestones.value.map((milestone) => {
    const startDate = new Date(milestone.startDate);
    const endDate = new Date(milestone.endDate);

    return {
      start: props.dueDatesOnly ? endDate : startDate,
      end: props.dueDatesOnly ? undefined : endDate,
      allDay: !props.dueDatesOnly,
      title: milestone.milestoneTitle,
      color: "blue",
      id: milestone._id,
      extendedProps: {
        milestone: milestone,
        type: EventTypes.MILESTONE,
      },
    };
  }),
);

const moduleEvents: ComputedRef<EventInput[]> = computed(() =>
  modules.value.map((module) => {
    const startDate = new Date(module.startDate);
    const endDate = new Date(module.endDate);

    return {
      start: props.dueDatesOnly ? endDate : startDate,
      end: props.dueDatesOnly ? undefined : endDate,
      allDay: !props.dueDatesOnly,
      title: module.moduleName,
      color: "purple",
      id: module._id,
      extendedProps: {
        module: module,
        type: EventTypes.MODULE,
      },
    };
  }),
);

const events = computed(() => [
  ...taskEvents.value,
  ...activityEvents.value,
  ...milestonesEvents.value,
  ...moduleEvents.value,
]);

const calendarOptions = ref<CalendarOptions>({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay",
  },
  initialView: "dayGridMonth",
  events: events.value,
  editable: !props.dueDatesOnly,
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
      case EventTypes.MILESTONE:
        milestoneInfo.value.milestone =
          event.event._def.extendedProps.milestone;
        milestoneInfo.value.show = true;
        break;
      case EventTypes.MODULE:
        moduleInfo.value.module = event.event._def.extendedProps.module;
        moduleInfo.value.show = true;
        break;
    }
  },
  async eventChange(arg) {
    // get new start and end dates
    if (arg.event.extendedProps.type !== EventTypes.TASK) {
      error.value.message = "Only tasks can be updated from the calendar view";
      error.value.show = true;
      arg.revert();
    }

    const newStartDate = new Date(arg.event.startStr);
    const newEndDate = new Date(arg.event.endStr);
    const task: Task | undefined = tasks.value.find(
      (task) => task._id === arg.event.id,
    );

    if (!task) {
      error.value.message = "Task not found";
      error.value.show = true;
      arg.revert();
      return;
    }

    if (!task?._id) {
      error.value.message = "Task ID not found";
      error.value.show = true;
      arg.revert();
      return;
    }

    if (!task?.status) {
      error.value.message = "Task status not found";
      error.value.show = true;
      arg.revert();
      return;
    }

    const newTask = {
      title: task.title,
      startDate: newStartDate,
      endDate: newEndDate,
      hrsCompleted: task.hrsCompleted,
      hrsRequired: task.hrsRequired,
      dependantTasks: task.dependantTasks,
      progress: task.status,
      taskId: task._id,
      activities: task.activities,
    };

    const result = await TaskService.update(newTask, authStore.authToken);

    if (result.success) {
      await userStore.getUser();
      success.value.message = "Task updated successfully";
      success.value.show = true;
    } else {
      error.value.message = result.error ?? "Error updating task";
      error.value.show = true;
      arg.revert();
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
  milestones.value = userStore.milestones;
  modules.value = userStore.modules;
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
        <v-card elevation="3" rounded="md"> </v-card>
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
  <MilestoneInfo
    v-if="milestoneInfo.milestone"
    v-model:show="milestoneInfo.show"
    :milestone="milestoneInfo.milestone"
    :close="() => (milestoneInfo.show = false)"
    editable
  />
  <ModuleInfo
    v-if="moduleInfo.module"
    v-model:show="moduleInfo.show"
    :module="moduleInfo.module"
    :close="() => (moduleInfo.show = false)"
    editable
  />
  <Alert
    v-model:show="success.show"
    type="success"
    :message="success.message"
    :close="() => (success.show = false)"
  />
  <Alert
    v-model:show="error.show"
    type="error"
    :message="error.message"
    :close="() => (error.show = false)"
  />
</template>

<style>
.fc-daygrid-event {
  cursor: pointer;
}

.fc-daygrid-event:hover {
  filter: brightness(90%);
}

.fc-event {
  cursor: pointer;
}

.fc-event:hover {
  filter: brightness(90%);
}
</style>
