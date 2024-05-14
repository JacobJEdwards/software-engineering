<script setup lang="ts">
import { computed, ComputedRef } from "vue";
import { Task, TaskStatuses } from "../../typings/user";

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
</script>

<template>
  <v-row class="d-flex justify-center align-center">
    <v-col cols="12" md="4">
      <v-card class="mb-4" flat>
        <v-card-title>
          {{ completedTasks.length }}
        </v-card-title>
        <v-card-text> Completed Tasks </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card class="mb-4" flat>
        <v-card-title>
          {{ inProgressTasks.length }}
        </v-card-title>
        <v-card-text> In Progress Tasks </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card class="mb-4" flat>
        <v-card-title>
          {{ startedTasks.length }}
        </v-card-title>
        <v-card-text> Started Tasks </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped></style>
