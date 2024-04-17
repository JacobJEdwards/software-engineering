<script setup lang="ts">
import { useTheme, useDisplay } from "vuetify";
import { useRouter } from "vue-router";

const theme = useTheme();
const router = useRouter();
const { mdAndDown } = useDisplay();

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
}
</script>

<template>
  <v-container
    class="mx-auto d-flex align-center justify-center"
    v-if="!mdAndDown"
  >
    <v-row class="my-4">
      <v-col cols="12">
        <h1 class="text-3xl font-bold">
          {{ router.currentRoute.value.meta.title }}
        </h1>
      </v-col>
      <v-divider
        color="black"
        class="bg-grey-darken-4 text-black"
        thickness="4"
      ></v-divider>
    </v-row>
  </v-container>
</template>
