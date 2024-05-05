<script setup lang="ts">
import { computed, ComputedRef } from "vue";
import {
  Semester,
  TaskStatuses,
  Module,
  Milestone,
  Task,
} from "../typings/user";

const props = defineProps<{
  selectedSemester: Semester;
}>();

const modules: ComputedRef<Module[]> = computed(
  () => props.selectedSemester.modules ?? [],
);

const milestones: ComputedRef<Milestone[]> = computed(() =>
  modules.value.flatMap((module) => module.milestones),
);

const tasks: ComputedRef<Task[]> = computed(() =>
  milestones.value.flatMap((milestone) => milestone.tasks),
);

const completedTasks: ComputedRef<Task[]> = computed(() =>
  tasks.value.filter((task) => task.status === TaskStatuses.COMPLETED),
);

const inProgressTasks: ComputedRef<Task[]> = computed(() =>
  tasks.value.filter((task) => task.status === TaskStatuses.IN_PROGRESS),
);

const startedTasks: ComputedRef<Task[]> = computed(() =>
  tasks.value.filter((task) => task.status === TaskStatuses.STARTED),
);
</script>

<template>
  <v-card v-if="props.selectedSemester" class="" flat>
    <v-card-title class="d-flex justify-between align-center">
      {{ props.selectedSemester.semesterName }}
    </v-card-title>
    <v-card-subtitle>
      {{ new Date(props.selectedSemester.startDate).toLocaleDateString() }}
      -
      {{ new Date(props.selectedSemester.endDate).toLocaleDateString() }}
    </v-card-subtitle>
    <v-card-text>
      <v-row>
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
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary"> View Details </v-btn>
    </v-card-actions>
  </v-card>
  <v-card v-else>
    <v-card-title> No semester selected </v-card-title>
    <v-card-text></v-card-text>
  </v-card>
</template>

<style scoped></style>
