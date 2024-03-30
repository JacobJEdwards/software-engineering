<script setup lang="ts">
import type { Task } from "../typings/user"

defineProps<{ task: Task }>()

</script>

<template>
  <v-card class="mx-auto" max-width="344" outlined>
    <v-card-title>{{ task.name }}</v-card-title>
  </v-card>
</template>

<style scoped></style>
