<script setup lang="ts">
import { ref, watch } from "vue";
import { useUserStore } from "../stores";
import Task from "./Task.vue";
import { Milestone } from "../typings/user";
import { Task as TaskType } from "../typings/user";

const props = defineProps<{
  milestone: Milestone;
}>();

const emits = defineEmits(["add-task"]);

const userStore = useUserStore();

const tasks = ref<TaskType[]>(props.milestone.tasks);

watch(
  () => props.milestone.tasks,
  (newTasks) => {
    tasks.value = newTasks;
  },
);

userStore.$subscribe(() => {
  tasks.value = props.milestone.tasks;
});
</script>

<template>
  <v-list>
    <v-list-item>
      <v-list-item-subtitle>
        {{ tasks.length }}
        {{ tasks.length === 1 ? "task" : "tasks" }}
      </v-list-item-subtitle>
      <v-divider inset color="error"></v-divider>
    </v-list-item>
    <Task v-for="task in tasks" :key="task._id" :task="task" />
    <v-divider inset></v-divider>
  </v-list>
</template>

<style scoped></style>
