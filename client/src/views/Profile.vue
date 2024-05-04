<script setup lang="ts">
import ScheduleGenerator from "../components/ScheduleGenerator.vue";
import ScheduleUpload from "../components/ScheduleUpload.vue";
import { useUserStore } from "../stores";

import { ref } from "vue";

const userStore = useUserStore();

const showScheduleGenerator = ref<boolean>(false);
const showScheduleUpload = ref<boolean>(false);

const toggleScheduleGenerator = () => {
  showScheduleGenerator.value = !showScheduleGenerator.value;
};

const toggleScheduleUpload = () => {
  showScheduleUpload.value = !showScheduleUpload.value;
};
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="6">
        <v-card title="User Data" prepend-icon="mdi-account-circle-outline">
          <v-card-text>
            <v-list>
              <v-list-item title="Name">{{ userStore.user?.name }}</v-list-item>
              <v-list-item title="Email">{{
                userStore.user?.email
              }}</v-list-item>
              <v-list-item title="Semesters">{{
                userStore.user?.semester.length
              }}</v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="6">
        <v-row>
          <v-col cols="12">
            <v-card title="Schedule Upload" prepend-icon="mdi-upload">
              <v-card-text>
                <v-btn
                  @click="toggleScheduleUpload"
                  color="secondary"
                  class="my-4"
                  rounded="md"
                  block
                  >{{ showScheduleUpload ? "Hide" : "Show" }} Schedule
                  Upload</v-btn
                >
                <ScheduleUpload v-if="showScheduleUpload" />
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card title="Schedule Generator" prepend-icon="mdi-calendar">
              <v-card-text>
                <v-btn
                  @click="toggleScheduleGenerator"
                  color="secondary"
                  class="my-4"
                  rounded="md"
                  block
                  >{{ showScheduleGenerator ? "Hide" : "Show" }} Schedule
                  Generator</v-btn
                >
                <ScheduleGenerator v-if="showScheduleGenerator" />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
