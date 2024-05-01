<script setup lang="ts">
import { Task } from "../typings/user";
import { ref } from "vue";
import TaskInfo from "./modals/TaskInfo.vue";

const props = defineProps<{
  task: Task;
  small?: boolean;
  editable?: boolean;
}>();

const finalDate = new Date(props.task.endDate).toDateString();

const modelVisible = ref<boolean>(false);
</script>

<template>
  <v-list-item
    v-if="small"
    :title="task.title"
    :subtitle="finalDate"
    :key="task._id"
  >
    <template v-slot:append>
      <v-btn
        icon="mdi-information"
        @click="modelVisible = true"
        variant="text"
      />
    </template>
  </v-list-item>
  <TaskInfo
    :task="props.task"
    :visible="modelVisible"
    :editable="props.editable"
    :close="() => (modelVisible = false)"
  />
</template>

<style scoped></style>
