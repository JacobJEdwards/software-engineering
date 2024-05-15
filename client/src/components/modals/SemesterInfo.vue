<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
  Semester,
  Module,
  Milestone,
  Task,
  Activity,
} from "../../typings/user";
import { useLoading, useSuccessErrorMessage } from "../../utils/utils.ts";
import Alert from "../utils/Alert.vue";
import TaskFilter from "../utils/TaskFilter.vue";

const { loading } = useLoading();
const { success, error } = useSuccessErrorMessage();

const show = defineModel("show", {
  type: Boolean,
  default: false,
});

const props = defineProps<{
  close: () => void;
  semester: Semester;
}>();

const showFilter = ref<boolean>(false);

const modules = ref<Module[]>(props.semester.modules);

const milestones = computed(() =>
  modules.value.reduce<Milestone[]>(
    (acc, module) => [...acc, ...module.milestones],
    [],
  ),
);

const tasks = computed(() =>
  milestones.value.reduce<Task[]>(
    (acc, milestone) => [...acc, ...milestone.tasks],
    [],
  ),
);

watch(
  () => props,
  () => {
    modules.value = props.semester.modules;
  },
  { deep: true },
);
</script>

<template>
  <v-dialog
    scrollable
    v-model="show"
    max-width="800px"
    class="p-4"
    max-height="600px"
    @click:outside="props.close"
  >
    <v-card>
      <v-card-title class="d-flex justify-space-between">
        <span class="headline">Semester Info</span>
        <v-btn icon="mdi-close" variant="text" @click="props.close"></v-btn>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-list-item>
              <v-list-item-title class="headline">
                {{ props.semester.semesterName }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ new Date(props.semester.startDate).toLocaleDateString() }} -
                {{ new Date(props.semester.endDate).toLocaleDateString() }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-col>
          <v-divider></v-divider>
          <v-col cols="12">
            <v-list-item>
              <v-list-item-title class="headline"> Modules </v-list-item-title>
              <v-list-item-subtitle>
                {{ modules.length }}
              </v-list-item-subtitle>
              <template #append>
                <router-link
                  to="/modules"
                  class="text-blue-500 text-sm hover:text-blue-700 focus:outline-none"
                >
                  View All
                </router-link>
              </template>
            </v-list-item>
          </v-col>
          <v-divider></v-divider>
          <v-col cols="12">
            <v-list-item>
              <v-list-item-title class="headline">
                Milestones
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ milestones.length }}
              </v-list-item-subtitle>
              <template #append>
                <router-link
                  to="/milestones"
                  class="text-blue-500 text-sm hover:text-blue-700 focus:outline-none"
                >
                  View All
                </router-link>
              </template>
            </v-list-item>
          </v-col>
          <v-divider></v-divider>
          <v-col cols="12">
            <v-list-item>
              <v-list-item-title class="headline"> Tasks </v-list-item-title>
              <v-list-item-subtitle>
                {{ tasks.length }}
              </v-list-item-subtitle>
              <template #append>
                <router-link
                  to="/tasks"
                  class="text-blue-500 text-sm hover:text-blue-700 focus:outline-none"
                >
                  View All
                </router-link>
              </template>
            </v-list-item>
          </v-col>
        </v-row>
        <TaskFilter :tasks="tasks" v-if="showFilter" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
