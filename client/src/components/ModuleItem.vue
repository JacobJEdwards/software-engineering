<script setup lang="ts">
import { Module } from "../typings/user.ts";

const props = defineProps<{
  module: Module;
}>();
</script>

<template>
  <v-list-item class="mb-4" flat>
    <v-list-item-title class="text-h6">{{
      props.module.moduleName
    }}</v-list-item-title>
    <v-list-item-subtitle>{{ props.module.moduleCode }}</v-list-item-subtitle>
  </v-list-item>
</template>

<style scoped></style>
