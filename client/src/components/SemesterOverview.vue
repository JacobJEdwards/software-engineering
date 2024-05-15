<script setup lang="ts">
import { ref, computed, ComputedRef } from "vue";
import {
  Semester,
  TaskStatuses,
  Module,
  Milestone,
  Task,
} from "../typings/user";
import SemesterInfo from "./modals/SemesterInfo.vue";
import TaskFilter from "./utils/TaskFilter.vue";
import ModuleItem from "./ModuleItem.vue";

const props = defineProps<{
  selectedSemester: Semester;
}>();

const showDetails = ref<boolean>(false);

const modules: ComputedRef<Module[]> = computed(
  () => props.selectedSemester.modules ?? [],
);

const milestones: ComputedRef<Milestone[]> = computed(() =>
  modules.value.flatMap((module) => module.milestones),
);

const tasks: ComputedRef<Task[]> = computed(() =>
  milestones.value.flatMap((milestone) => milestone.tasks),
);
</script>

<template>
  <v-card v-if="props.selectedSemester" class="" flat>
    <v-card-title class="d-flex justify-between align-center">
      {{ props.selectedSemester.semesterName }}
      <v-btn
        @click="showDetails = true"
        class="mr-0"
        variant="text"
        icon="mdi-information-outline"
      ></v-btn>
    </v-card-title>
    <v-card-subtitle>
      {{ new Date(props.selectedSemester.startDate).toLocaleDateString() }}
      -
      {{ new Date(props.selectedSemester.endDate).toLocaleDateString() }}
    </v-card-subtitle>
    <v-card-text>
      <TaskFilter :tasks="tasks" />
    </v-card-text>
  </v-card>
  <v-card v-else title="No semester selected" flat> </v-card>
  <SemesterInfo
    v-model:show="showDetails"
    :semester="props.selectedSemester"
    :close="() => (showDetails = false)"
  />
</template>

<style scoped></style>
