<script setup lang="ts">
import {ref} from "vue"
import {API_ROUTE} from "../config.ts"
import {useAuthStore, useUserStore} from "../stores"


const file = ref<File | null>(null);
const errorMessage = ref("")
const successMessage = ref("")
const loading = ref(false)

const authStore = useAuthStore()
const userStore = useUserStore()

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
        "Authorization": authStore.authToken ?? "",
      }
    })

    if (!response.ok) {
      // add text
      throw new Error("Error uploading file")
    }

    const data = await response.json();
    successMessage.value = "Schedule uploaded"

    await userStore.getUser()

  } catch (e: unknown) {
    console.error(e)
    errorMessage.value = "Error uploading file"
  } finally {
    loading.value = false;
  }
}

</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-file-input
          label="Upload schedule"
          @change="uploadFile"
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
        <v-alert v-if="errorMessage" type="error">{{ errorMessage }}</v-alert>
        <v-alert v-if="successMessage" type="success">{{ successMessage }}</v-alert>
      </v-col>
    </v-row>
  </v-container>

</template>
<style scoped>

</style>
