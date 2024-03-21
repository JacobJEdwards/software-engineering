<script setup lang="ts">
import { useRouter } from "vue-router"
import { useAuthStore } from "../stores"
import { useTheme } from 'vuetify'

const theme = useTheme()


function toggleTheme () {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

const router = useRouter();
const authStore = useAuthStore()

const logout = async () => {
    authStore.logout()
    await router.push("/login");
}

// add a bottom border
</script>

<template>
  <v-app-bar app color="primary" dark class="elevation-0">
    <v-container class="mx-auto d-flex align-center justify-center">
      <v-toolbar-title>Wonderful Tasks</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="logout" class="" >Logout</v-btn>
    </v-container>
    <v-btn @click="toggleTheme" :icon="!theme.global.current.value.dark ? 'mdi-white-balance-sunny' : 'mdi-weather-night'"></v-btn>
  </v-app-bar>
</template>
