<script setup lang="ts">
import Calendar from "../components/Calendar.vue";
import Gantt from "../components/Gantt.vue";
import { ref } from "vue";
import { useUserStore } from "../stores";

const userStore = useUserStore();
const tab = ref<number>(1);
</script>

<template>
  <v-container>
    <v-tabs v-model="tab" align-tabs="center" background-color="transparent">
      <v-tab :value="1">Calendar</v-tab>
      <v-tab :value="2">Gantt</v-tab>
    </v-tabs>
    <v-divider class="my-6"></v-divider>
    <Calendar v-if="tab === 1" />
    <Gantt v-else />
  </v-container>
</template>
