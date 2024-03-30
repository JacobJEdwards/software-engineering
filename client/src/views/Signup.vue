<script setup lang="ts">
import {API_ROUTE} from "../config.ts"
import {useRouter} from "vue-router"
import {ref} from 'vue'
import { useLoading, useSuccessErrorMessage } from "../utils/utils.ts"
import { emailRules } from "../utils/form.ts"
import {useDisplay} from "vuetify";

const router = useRouter()

const { loading } = useLoading()
const { success, error } = useSuccessErrorMessage()

const name = ref<string>("");
const email = ref<string>("");
const password = ref<string>("");
const showPassword = ref<boolean>(false);

const { mdAndDown } = useDisplay()

const signup = async () => {
  loading.value = true;
  error.value = ""
  success.value = ""

   if (!name.value || !email.value || !password.value) {
        error.value = 'Please fill in all fields';
        loading.value = false;
        return;
   }

  try {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: name.value, password: password.value, email: email.value
      })
    }

    const res = await fetch(`${API_ROUTE}/auth/signup`, options);

    if (!res.ok) {
      throw new Error("Error on login")
    }


    const json = await res.json();

    const userId = json?.data?.userId;

    if (!userId) {
      throw new Error("Error on login")
    }

    success.value = "Signup successful"
    await redirectToLogin()

  } catch {
    error.value = "Error on signup"
    password.value = ""
  } finally {
    loading.value = false;
  }
}

const redirectToLogin = async () => {
  await router.push("/login")
}

</script>

<template>
      <v-container class="h-full d-flex justify-center align-center"> <!-- center the content -->
        <v-row align="center" justify="center">
          <v-col cols="12" md="6" v-if="!mdAndDown" class="hidden md:block d-flex justify-center align-center">
                <v-img src="https://via.placeholder.com/500" class="elevation-12" height="100%" width="100%"></v-img>
            </v-col>
            <v-col cols="12" md="6">
                <v-row>
                    <v-col cols="12" class="text-center">
                        <h1 class="text-3xl font-bold">Sign up</h1>
                        <p class="text-sm mt-2 text-gray-400">Sign up now to create an account.</p>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field v-model="name" placeholder="John Doe" label="Name" outlined append-inner-icon="mdi-account" variant="solo-filled"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field v-model="email" placeholder="email@email.com" :rules="emailRules" label="Email" type="email" outlined append-inner-icon="mdi-email" variant="solo-filled"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field v-model="password" label="Password" :type="showPassword ? 'text' : 'password'" outlined :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append-inner="showPassword = !showPassword" variant="solo-filled"></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-btn @click="signup" :loading="loading" color="grey-darken-4" class="w-full">Sign up</v-btn>
                    </v-col>
                    <v-col cols="12">
                        <v-alert v-if="error" type="error" dismissible>{{ error }}</v-alert>
                        <v-alert v-if="success" type="success" dismissible>{{ success }}</v-alert>
                    </v-col>
                    <v-col cols="12" class="text-center">
                         <p class="text-sm text-gray-400">Already have an account? <router-link to="/login" class="text-blue-500 text-sm hover:text-blue-700 focus:outline-none">Log in.</router-link></p>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>



<style scoped>
.elevation-12 {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
}
</style>
