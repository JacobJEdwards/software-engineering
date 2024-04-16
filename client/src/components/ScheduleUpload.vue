<script setup lang="ts">
import {ref} from "vue"
import {useAuthStore, useUserStore} from "../stores"
import { useSuccessErrorMessage, useLoading} from "../utils/utils.ts";
import { uploadFile} from "../services/user.ts";

const { success, error } = useSuccessErrorMessage()
const { loading } = useLoading()

const file = ref<File | null>(null);

const authStore = useAuthStore()
const userStore = useUserStore()

const saveFile = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files) return;

  file.value = target.files[0]

  success.value = ""
  error.value = ""
}

const submitFile = async () => {
  loading.value = true;
  error.value = ""

  if (!file.value) {
    error.value = "Please upload a file"
    loading.value = false;
    return;
  }

  const result = await uploadFile(authStore.authToken, file.value)

  if (result.success) {
    success.value = "Schedule uploaded"
    await userStore.getUser()
  } else {
    error.value = "Error uploading file"
  }

    loading.value = false;
}

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
        <v-btn @click="submitFile" :loading="loading" color="primary">Submit</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-alert v-if="error" type="error">{{ error }}</v-alert>
        <v-alert v-if="error" type="success">{{ success }}</v-alert>
      </v-col>
    </v-row>
  </v-container>

</template>
<style scoped>

</style>
