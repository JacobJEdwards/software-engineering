<script setup lang="ts">
import { ref } from "vue";
import CreateTask from "./modals/CreateTask.vue";
const modelVisible = ref<boolean>(false);
</script>

<template>
  <v-container>
    <v-btn
      @click="modelVisible = !modelVisible"
      color="secondary"
      rounded="md"
      block
      >Add Task</v-btn
    >
    <CreateTask :visible="modelVisible" :close="() => (modelVisible = false)" />
  </v-container>
</template>
