<script setup lang="ts">
import { useRouter } from "vue-router"
import { useAuthStore } from "../stores/auth"

const router = useRouter();
const authStore = useAuthStore()

const logout = async () => {
    authStore.logout()
    await router.push("/login");
}

const links = [
  { display: "Home", to: { name: "home"} },
  { display: "Tasks", to: { name: "tasks"} },
  { display: "Schedule", to: { name: "schedule"} },
  { display: "Profile", to: { name: "profile"}}
]

</script>

<template>
  <v-app-bar app color="primary">
    <v-container class="mx-auto d-flex align-center justify-center">
      <v-toolbar-title>Wonderful Tasks</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn v-for="link in links" :key="link.display" :to="link.to" varient="text">{{ link.display }}</v-btn>
      <v-spacer></v-spacer>
      <v-btn @click="logout">Logout</v-btn>
    </v-container>
  </v-app-bar>
</template>
