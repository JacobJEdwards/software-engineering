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
      <v-card
        class="mb-4 text-center"
        flat
        text="Started Tasks"
        :title="startedTasks.length"
        border
      >
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card
        class="mb-4 text-center"
        flat
        :title="inProgressTasks.length"
        text="In Progress Tasks"
        border
      >
      </v-card>
    </v-col>
    <v-col cols="12" md="4">
      <v-card
        flat
        :title="completedTasks.length"
        text="Completed Tasks"
        class="mb-4 text-center"
        border
      >
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped></style>
