<script setup lang="ts">
import Task from "../components/Task.vue"
import { VueCookies } from "vue-cookies";
import { useRouter } from "vue-router"
import { inject, ref } from "vue"
import { API_ROUTE } from "../config.ts"

const loading = ref(true)

const $cookies = inject<VueCookies>("$cookies");
const router = useRouter()

</script>

<template>
  <!-- move into component -->
  <v-container v-if="loading">

  </v-container>
  <v-container v-else>

  </v-container>

</template>