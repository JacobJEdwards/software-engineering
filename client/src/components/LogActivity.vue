<script setup lang="ts">
import { useUserStore, useAuthStore } from "../stores";
import { ref } from "vue";
import { ActivitiesService } from "../services";
import { TaskStatuses } from "../typings/user.ts";
import { useLoading, useSuccessErrorMessage } from "../utils/utils.ts";

const { loading } = useLoading();
const { success, error } = useSuccessErrorMessage();

const userStore = useUserStore();
const authStore = useAuthStore();

const expanded = ref<boolean>(false);
const dialog = ref<boolean>(false);

const formData = ref<{
  activityTitle: string;
  activityType: string;
  activityDescription: string;
  hrsCompleted: number;
  tasks: string[];
}>({
  activityTitle: "",
  activityType: "",
  activityDescription: "",
  hrsCompleted: 0,
  tasks: [],
});

const closeForm = () => {
  dialog.value = false;
  error.value = "";
  success.value = "";
  formData.value = {
    activityTitle: "",
    activityType: "",
    activityDescription: "",
    hrsCompleted: 0,
    tasks: [],
  };
};

const submitForm = async () => {
  error.value = "";
  success.value = "";
  loading.value = true;

  if (
    !formData.value.activityTitle ||
    !formData.value.activityType ||
    !formData.value.activityDescription ||
    !formData.value.hrsCompleted ||
    !formData.value.tasks
  ) {
    error.value = "Please fill in all fields";
    loading.value = false;
    return;
  }

  const result = await ActivitiesService.create(
    authStore.authToken,
    formData.value,
  );

  if (!result.success) {
    error.value = result.error ?? "An error occurred";
    loading.value = false;
    return;
  }

  success.value = "Activity logged successfully";
  loading.value = false;
  console.log(result);
  closeForm();
};
</script>

<template>
  <v-btn
    v-if="!dialog"
    @mouseenter="expanded = true"
    @mouseleave="expanded = false"
    fab
    small
    color="primary"
    dark
    class="position-fixed bottom-20 right-10"
    max-width="10rem"
    @click="dialog = true"
  >
    <v-expand-x-transition>
      <span v-if="expanded" class="transition-element">
        <span class="text">Log Activity</span>
      </span>
    </v-expand-x-transition>
    <v-expand-x-transition>
      <span v-if="!expanded" class="transition-element">
        <v-icon>mdi-plus</v-icon>
      </span>
    </v-expand-x-transition>
  </v-btn>

  <!-- modal -->
  <v-dialog
    v-model="dialog"
    max-width="500px"
    scrollable
    @click:outside="closeForm"
  >
    <v-card class="p-4">
      <v-card-title class="headline">Log Activity</v-card-title>
      <v-form @submit.prevent="submitForm">
        <v-card-text>
          <v-container>
            <v-alert v-if="error" type="error" class="mb-4">{{
              error
            }}</v-alert>
            <v-alert v-if="success" type="success" class="mb-4">{{
              success
            }}</v-alert>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.activityTitle"
                  label="Activity Title"
                  required
                  :loading="loading"
                  aria-required="true"
                  outlined
                  variant="solo-filled"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.activityType"
                  label="Activity Type"
                  required
                  :loading="loading"
                  aria-required="true"
                  outlined
                  variant="solo-filled"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.activityDescription"
                  label="Activity Description"
                  required
                  :loading="loading"
                  aria-required="true"
                  outlined
                  variant="solo-filled"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.hrsCompleted"
                  label="Hours Completed"
                  required
                  :loading="loading"
                  aria-required="true"
                  outlined
                  variant="solo-filled"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="formData.tasks"
                  :items="
                    userStore.tasks.filter(
                      (task) => task.status !== TaskStatuses.COMPLETED,
                    )
                  "
                  item-text="title"
                  item-value="_id"
                  label="Tasks"
                  multiple
                  required
                  :loading="loading"
                  aria-required="true"
                  outlined
                  variant="solo-filled"
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" @click="closeForm" text="Cancel"></v-btn>
          <v-btn
            color="blue darken-1"
            type="submit"
            :loading="loading"
            text="Save"
          ></v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.transition-element {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
