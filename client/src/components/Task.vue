<script setup lang="ts">
import { defineProps } from "vue"

defineProps<{
  title: string
  milestone: string
}>()
</script>

<template>
  <v-card class="mx-auto" max-width="344" outlined>
    <v-card-title>{{ title }}</v-card-title>
    <v-card-subtitle>{{ milestone }}</v-card-subtitle>
    <v-card-text>
      <slot name="content"></slot>
    </v-card-text>
    <v-card-actions>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn text="Show Activities" v-on="on"></v-btn>
        </template>
        <v-list>
          <slot name="activities"></slot>
        </v-list>
      </v-menu>
    </v-card-actions>
  </v-card>
</template>

<style scoped></style>
