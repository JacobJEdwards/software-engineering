<script setup lang="ts">
import {inject, ref} from "vue"
import {API_ROUTE} from "../config.ts"
import {useAuthStore} from "../stores"


const file = ref<File | null>(null);
const errorMessage = ref("")
const successMessage = ref("")
const loading = ref(false)

const authStore = useAuthStore()

const uploadFile = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files) return;
  file.value = target.files[0]

  successMessage.value = ""
  errorMessage.value = ""
}

const submitFile = async () => {
  loading.value = true;
  errorMessage.value = ""

  if (!file.value) {
    errorMessage.value = "Please upload a file"
    loading.value = false;
    return;
  }

  try {
    const formData = new FormData();
    formData.append("file", file.value);

    const response = await fetch(`${API_ROUTE}/protected/upload`, {
      method: "POST",
      body: formData,
      headers: {
        "Authorization": authStore.authToken
      }
    })

    if (!response.ok) {
      // add text
      throw new Error("Error uploading file")
    }

    const data = await response.json();
    successMessage.value = "Schedule uploaded"

  } catch (e: unknown) {
    console.error(e)
    errorMessage.value = "Error uploading file"
  } finally {
    loading.value = false;
  }
}

</script>

<template>
  <v-form @submit.prevent="submitFile">
    <v-file-input
        label="Schedule Upload"
        @change="uploadFile"
        required>
    </v-file-input>
    <v-btn type="submit" :loading="loading">Upload</v-btn>
    <v-alert type="error" v-if="errorMessage">{{ errorMessage }}</v-alert>
    <v-alert type="success" v-if="successMessage">{{ successMessage }}</v-alert>
  </v-form>

</template>
<style scoped>

</style>
