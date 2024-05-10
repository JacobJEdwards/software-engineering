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

const show = defineModel("show", {
  type: Boolean,
  default: false,
});

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
    show.value = false;
  } else {
    error.value.message = result.error ?? "Error uploading file";
    error.value.show = true;
  }

  loading.value = false;
};
</script>

<template>
  <v-dialog v-model="show" max-width="500" scrollable>
    <v-card>
      <v-card-title>Upload Schedule</v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-file-input
                label="Upload schedule"
                @change="saveFile"
                accept=".csv"
                aria-required="true"
                prepend-icon="mdi-file-upload"
                variant="solo-filled"
                outlined
              ></v-file-input>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn text="Cancel" colo="error" @click="() => (show = false)"
          >Cancel</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn
          color="success"
          @click="submitFile"
          :loading="loading"
          :disabled="!file"
        >
          Upload
        </v-btn>
      </v-card-actions>
    </v-card>
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
  </v-dialog>
</template>
<style scoped></style>
