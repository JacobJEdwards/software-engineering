<script setup lang="ts">
import { useRouter } from "vue-router"
import { VueCookies } from "vue-cookies";
import { inject } from 'vue'

const $cookies = inject<VueCookies>("$cookies")

const router = useRouter();

const logout = async () => {
    $cookies?.remove("auth")
    await router.push("/login");
}
</script>

<template>
  <header>
  <v-app-bar app color="primary">
    <v-toolbar-title>Wonderful Tasks</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn :to="{ name: 'home'}" >Home</v-btn>
    <v-btn :to="{ name: 'tasks'}" >Tasks</v-btn>
    <v-btn :to="{ name: 'schedule'}" >Schedule</v-btn>
    <v-spacer></v-spacer>
    <v-btn @click="logout">Logout</v-btn>
  </v-app-bar>
  </header>
</template>