<script setup lang="ts">
import { useUserStore } from "../stores";

const userStore = useUserStore();
</script>

<template>
  <v-container>
    <v-skeleton-loader :loading="userStore.loading" type="list-item-two-line">
      <v-list-item rounded></v-list-item>
    </v-skeleton-loader>
  </v-container>
</template>
