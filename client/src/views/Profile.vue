<script setup lang="ts">
import ScheduleGenerator from "../components/ScheduleGenerator.vue";
import ScheduleUpload from "../components/ScheduleUpload.vue";
import { useUserStore } from "../stores";
import type { Semester, Task, Activity } from "../typings/user.ts";

import { computed, ref } from "vue";
import ChangeEmail from "../components/modals/ChangeEmail.vue";
import ChangeName from "../components/modals/ChangeName.vue";

const userStore = useUserStore();

const showScheduleGenerator = ref<boolean>(false);
const showScheduleUpload = ref<boolean>(false);

const semesters = ref<Semester[]>(userStore.user?.semester ?? []);
const semesterNames = computed(() =>
  semesters.value.map((s) => s.semesterName),
);

const modules = computed(() => semesters.value.flatMap((s) => s.modules));
const milestones = computed(() => modules.value.flatMap((m) => m.milestones));

const tasks = ref<Task[]>(userStore.tasks);
const activities = ref<Activity[]>(userStore.activities);

const toggleScheduleGenerator = () => {
  showScheduleGenerator.value = !showScheduleGenerator.value;
};

const toggleScheduleUpload = () => {
  showScheduleUpload.value = !showScheduleUpload.value;
};

const showChangeEmail = ref<boolean>(false);
const showChangeName = ref<boolean>(false);
const showChangePassword = ref<boolean>(false);

userStore.$subscribe(() => {
  semesters.value = userStore.user?.semester ?? [];
  tasks.value = userStore.tasks;
  activities.value = userStore.activities;
});
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="6">
        <v-card
          title="User Data"
          prepend-icon="mdi-account-circle-outline"
          :loading="userStore.loading"
        >
          <v-card-text>
            <v-list>
              <v-list-item title="Name"
                >{{ userStore.user?.name }}
                <template #append>
                  <v-btn
                    @click="showChangeName = true"
                    :icon="showChangeName ? 'mdi-close' : 'mdi-pencil'"
                    variant="text"
                  ></v-btn>
                </template>
              </v-list-item>
              <v-list-item title="Email"
                >{{ userStore.user?.email }}
                <template #append>
                  <v-btn
                    @click="showChangeEmail = true"
                    :icon="showChangeEmail ? 'mdi-close' : 'mdi-pencil'"
                    variant="text"
                  ></v-btn>
                </template>
              </v-list-item>
              <v-list-item title="Semesters">{{
                semesters?.length
              }}</v-list-item>
              <v-list-item title="Modules">{{ modules?.length }}</v-list-item>
              <v-list-item title="Milestones">{{
                milestones?.length
              }}</v-list-item>
              <v-list-item title="Tasks">{{ tasks?.length }}</v-list-item>
              <v-list-item title="Activities">{{
                activities?.length
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
                <ScheduleGenerator
                  v-model:show="showScheduleGenerator"
                  :close="toggleScheduleGenerator"
                  :semester-names="semesterNames"
                />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
  <ChangeEmail
    :close="() => (showChangeEmail = false)"
    v-model:show="showChangeEmail"
  />
  <ChangeName
    :close="() => (showChangeName = false)"
    v-model:show="showChangeName"
  />
  <ScheduleUpload v-model:show="showScheduleUpload" />
</template>
