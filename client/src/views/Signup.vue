<script setup lang="ts">
import {API_ROUTE} from "../config.ts"
import {useRouter} from "vue-router"
import {ref} from 'vue'
import { useLoading, useCookies, useSuccessErrorMessage } from "../utils/utils.ts"
import { nameRules, emailRules, passwordRules } from "../utils/form.ts"

const $cookies = useCookies()
const router = useRouter()

const { loading } = useLoading()
const { success, error } = useSuccessErrorMessage()

const name = ref("");
const email = ref("");
const password = ref("");

const signup = async () => {
  loading.value = true;
  error.value = ""
  success.value = ""

   if (!name.value || !email.value || !password.value) {
        error.value = 'Please fill in all fields';
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

    const {userId} = await res.json();

    if (!userId) {
      throw new Error("Error on login")
    }

    $cookies?.set("user-id", userId)
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
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Sign Up</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="signup">
              <v-text-field v-model="name" validate-on="input" :rules="nameRules" :counter="6" label="Name" required></v-text-field>
              <v-text-field v-model="email" validate-on="input" :rules="emailRules" label="Email" type="email" required></v-text-field>
              <v-text-field v-model="password" validate-on="input" :rules="passwordRules" label="Password" type="password" required></v-text-field>
              <v-btn type="submit" color="primary" class="mr-4">Sign Up</v-btn>
              <v-btn @click="redirectToLogin">Login</v-btn>
              <v-alert v-if="error" type="error" dismissible>{{ error }}</v-alert>
              <v-alert v-if="success" type="success" dismissible>{{ success }}</v-alert>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.elevation-12 {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
}
</style>
