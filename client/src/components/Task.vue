<script setup lang="ts">
import { Task } from "../typings/user";
import { ref } from "vue";
import TaskInfo from "./modals/TaskInfo.vue";

const props = defineProps<{
  task: Task;
  editable?: boolean;
}>();

const finalDate = new Date(props.task.endDate).toDateString();

const modelVisible = ref<boolean>(false);
</script>

<template>
  <v-list-item :title="task.title" :key="task._id">
    <template #subtitle>
      <div><span class="font-bold">Due: </span>{{ finalDate }}</div>
    </template>
    <template #append>
      <v-chip
        class="text-center p-0 mr-3"
        :color="task.status === 'Completed' ? 'success' : 'error'"
        variant="tonal"
        pill
      >
        {{ Math.floor((task.hrsCompleted / task.hrsRequired) * 100) }}% complete
      </v-chip>
      <v-btn
        @click="modelVisible = true"
        variant="text"
        :icon="modelVisible ? 'mdi-close' : 'mdi-pencil'"
      />
    </template>
  </v-list-item>
  <TaskInfo
    v-model:show="modelVisible"
    :task="props.task"
    :editable="props.editable"
    :close="() => (modelVisible = false)"
  />
</template>

<style scoped></style>
