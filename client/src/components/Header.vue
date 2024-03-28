<script setup lang="ts">
import { useTheme } from 'vuetify'
import { useRouter} from "vue-router";

const theme = useTheme()
const router = useRouter()

function toggleTheme () {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
</script>

<template>
  <!--
  <v-app-bar app color="primary" dark>
    <v-container class="mx-auto d-flex align-center justify-center">
      <v-toolbar-title>Wonderful Tasks</v-toolbar-title>
      <!-- <v-btn @click="logout" class="" >Logout</v-btn>
    </v-container>
    <v-btn @click="toggleTheme" :icon="!theme.global.current.value.dark ? 'mdi-white-balance-sunny' : 'mdi-weather-night'"></v-btn>
  </v-app-bar>
  -->
  <v-container class="mx-auto d-flex align-center justify-center">
      <v-row class="my-4">
        <v-col cols="12">
            <h1 class="text-3xl font-bold">{{ router.currentRoute.value.meta.title }}</h1>
        </v-col>
        <v-divider color="black" class="bg-grey-darken-4 text-black" thickness="4"></v-divider>
    </v-row>
  </v-container>

</template>
