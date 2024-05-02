<script setup lang="ts">
import { useUserStore } from "../stores";
import UserLoading from "./UserLoading.vue";

const userStore = useUserStore();
</script>

<template>
  <v-navigation-drawer app color="secondary">
    <template #prepend>
      <v-list-item
        lines="two"
        subtitle="Logged in"
        :title="userStore.user?.name ?? 'Unknown'"
      >
      </v-list-item>
    </template>

    <v-divider></v-divider>

    <v-list v-if="userStore.loading">
      <UserLoading v-for="i in 6" :key="i" />
    </v-list>
    <v-list v-else> </v-list>
  </v-navigation-drawer>
</template>

<style scoped></style>
