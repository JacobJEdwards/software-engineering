<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore, useUserStore } from "../stores";
import { useSuccessErrorMessage, useLoading } from "../utils/utils.ts";
import { uploadFile } from "../services/user.ts";
import Alert from "./utils/Alert.vue";

const { success, error } = useSuccessErrorMessage();
const { loading } = useLoading();

const file = ref<File | null>(null);

const authStore = useAuthStore();
const userStore = useUserStore();

const saveFile = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files) return;

  file.value = target.files[0];

  success.value.message = "";
  success.value.show = false;
  error.value.message = "";
  error.value.show = false;
};

const submitFile = async () => {
  loading.value = true;
  error.value.message = "";
  error.value.show = false;

  success.value.message = "";
  success.value.show = false;

  if (!file.value) {
    error.value.message = "No file selected";
    error.value.show = true;
    loading.value = false;
    return;
  }

  const result = await uploadFile(authStore.authToken, file.value);

  if (result.success) {
    success.value.message = "Schedule uploaded";
    success.value.show = true;
    await userStore.getUser();
  } else {
    error.value.message = result.error ?? "Error uploading file";
    error.value.show = true;
  }

  loading.value = false;
};
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-file-input
          label="Upload schedule"
          @change="saveFile"
          accept=".csv"
          aria-required="true"
          prepend-icon="mdi-file-upload"
        ></v-file-input>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-btn @click="submitFile" :loading="loading" color="primary"
          >Submit</v-btn
        >
      </v-col>
    </v-row>
  </v-container>
  <Alert
    type="success"
    :message="success.message"
    :close="() => (success.show = false)"
    v-model:show="success.show"
  />
  <Alert
    type="error"
    :message="error.message"
    :close="() => (error.show = false)"
    v-model:show="error.show"
  />
</template>
<style scoped></style>
