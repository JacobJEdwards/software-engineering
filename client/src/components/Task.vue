<script setup lang="ts">
import { defineProps } from "vue"

/*
export type Task = {
  name: string;
  startDate: Date;
  endDate: Date;
  status: TaskStatus;
  notes: {
    date: Date;
    content: string
  };
}
*/

defineProps({
    task: {
        type: Object,
        required: true
    }
})

</script>

<template>
  <v-card class="mx-auto" max-width="344" outlined>
    <v-card-title>{{ task.name }}</v-card-title>
  </v-card>
</template>

<style scoped></style>
