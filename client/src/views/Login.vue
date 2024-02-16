<script setup lang="ts">
import { API_ROUTE } from "/src/config.ts"
import { VueCookies } from "vue-cookies";

import { useRouter } from "vue-router"

import { ref, inject } from 'vue'

const $cookies = inject<VueCookies>("$cookies")

const loading = ref(false);
const email = ref('')
const password = ref('')
const error = ref("")
const successMessage = ref("")

const router = useRouter()

const login = async () => {
    loading.value = true;
    error.value = ""
    successMessage.value = ""

  $cookies?.set("auth", "token")
  await router.push("/")
  return;

    if (!email.value || !password.value) {
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
                email: email.value, password: password.value
            })
        }

        const res = await fetch(`${API_ROUTE}/auth/login`, options);

        if (!res.ok) {
            throw new Error("Error on login")
        }

        const { token } = await res.json();

        if (!token) {
            throw new Error("Error on login")
        }

        $cookies?.set("auth", token)
        successMessage.value = "Login successful"
        await router.push("/")

    } catch (e) {
        console.error(e)
        error.value = "Error on login"
        password.value = ""
    } finally {
        loading.value = false;
    }
}

const redirectToSignup = () => {
    router.push("/signup")
}

</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="login">
              <v-text-field v-model="email" label="Email" required></v-text-field>
              <v-text-field v-model="password" label="Password" type="password" required></v-text-field>
              <v-btn type="submit" color="primary" class="mr-4">Login</v-btn>
              <v-btn @click="redirectToSignup">Sign up</v-btn>
              <v-alert v-if="error" type="error" dismissible>{{ error }}</v-alert>
              <v-alert v-if="successMessage" type="success" dismissible>{{ successMessage }}</v-alert>
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