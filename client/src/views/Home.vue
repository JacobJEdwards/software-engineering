<script setup lang="ts">
import Task from "../components/Task.vue"
import { useLoading } from "../utils/utils.ts"
import { useUserStore } from "../stores/user.ts"
import { onMounted} from "vue";

const userStore = useUserStore()
console.log(userStore.loading)

</script>

<template>
  <!-- move into component -->
  <v-container v-if="userStore.loading">
    <v-skeleton-loader
          :loading="userStore.loading"
          type="list-item-two-line"
        >
          <v-list-item rounded></v-list-item>
        </v-skeleton-loader>
  </v-container>
  <v-container v-else>
    No tasks to display
  </v-container>

</template>
