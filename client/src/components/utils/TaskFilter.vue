<script setup lang="ts">
import { computed, ComputedRef } from "vue";
import { Task, TaskStatuses } from "../../typings/user";
import { k } from "vite/dist/node/types.d-aGj9QkWt";

const props = defineProps<{
  tasks: Task[];
}>();

const completedTasks: ComputedRef<Task[]> = computed(() =>
  props.tasks.filter((task) => task.status === TaskStatuses.COMPLETED),
);

const inProgressTasks: ComputedRef<Task[]> = computed(() =>
  props.tasks.filter((task) => task.status === TaskStatuses.IN_PROGRESS),
);

const startedTasks: ComputedRef<Task[]> = computed(() =>
  props.tasks.filter((task) => task.status === TaskStatuses.STARTED),
);

const percentageCompleted = computed(() => {
  const totalTasks = props.tasks.length;
  const num = completedTasks.value.length;

  return (num / totalTasks) * 100;
});

const percentageInProgress = computed(() => {
  const totalTasks = props.tasks.length;
  const num = inProgressTasks.value.length;

  return (num / totalTasks) * 100;
});

const percentageStarted = computed(() => {
  const totalTasks = props.tasks.length;
  const num = startedTasks.value.length;

  return (num / totalTasks) * 100;
});
</script>

<template>
  <v-row class="d-flex justify-center align-center">
    <v-col cols="12" md="4">
      <v-card flat border>
        <v-card-title class="text-center text-red">{{
          startedTasks.length
        }}</v-card-title>
        <v-card-text class="text-center">
          <v-progress-linear
            v-model="percentageStarted"
            color="red"
            height="10"
            class="mb-4"
          ></v-progress-linear>
          <span class="text-centre">Started</span>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card flat border>
        <v-card-title class="text-center text-blue">{{
          inProgressTasks.length
        }}</v-card-title>
        <v-card-text class="text-center">
          <v-progress-linear
            v-model="percentageInProgress"
            color="blue"
            height="10"
            class="mb-4"
          ></v-progress-linear>
          <span class="text-centre">In Progress</span>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card flat border>
        <v-card-title class="text-center text-green">{{
          completedTasks.length
        }}</v-card-title>
        <v-card-text class="text-center">
          <v-progress-linear
            v-model="percentageCompleted"
            color="green"
            height="10"
            class="mb-4"
          ></v-progress-linear>
          <span class="text-centre">Completed</span>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped></style>
