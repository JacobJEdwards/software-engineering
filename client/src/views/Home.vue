<script setup lang="ts">
import ScheduleGenerator from "../components/ScheduleGenerator.vue";
import ScheduleUpload from "../components/ScheduleUpload.vue"

import { ref } from "vue";

const showScheduleGenerator = ref(false);

const toggleScheduleGenerator = () => {
  showScheduleGenerator.value = !showScheduleGenerator.value;
};

</script>

<template>
<v-container>
    <v-row>
      <v-col>
        <v-btn @click="toggleScheduleGenerator">{{ showScheduleGenerator ? "Hide" : "Show"}} Schedule Generator</v-btn>
        <ScheduleUpload />
      </v-col>
    </v-row>
    <v-row v-if="showScheduleGenerator">
      <v-col>
        <ScheduleGenerator />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped></style>
