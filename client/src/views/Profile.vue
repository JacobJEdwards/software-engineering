<script setup lang="ts">
import ScheduleGenerator from "../components/ScheduleGenerator.vue";
import ScheduleUpload from "../components/ScheduleUpload.vue"

import { ref } from "vue";

const showScheduleGenerator = ref<boolean>(false);

const toggleScheduleGenerator = () => {
  showScheduleGenerator.value = !showScheduleGenerator.value;
};

</script>

<template>
  <v-container>
    <ScheduleUpload />
    <v-row>
      <v-col>
        <v-btn @click="toggleScheduleGenerator">{{ showScheduleGenerator ? "Hide" : "Show"}} Schedule Generator</v-btn>
      </v-col>
    </v-row>
    <v-row v-if="showScheduleGenerator">
      <v-col>
        <ScheduleGenerator />
      </v-col>
    </v-row>
  </v-container>
</template>

