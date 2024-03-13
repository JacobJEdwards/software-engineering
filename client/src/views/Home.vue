<script setup lang="ts">
import Task from "../components/Task.vue"
import UserLoading from "../components/UserLoading.vue"
import { useUserStore } from "../stores/user.ts"

const userStore = useUserStore()

const semester = userStore.user?.semester

console.log(semester);
console.log(userStore.user);

</script>

<template>
  <UserLoading v-if="userStore.loading" />

  <v-container v-else>
    <!-- welcome back message -->
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            <span class="title">Welcome back, {{ userStore.user?.name }}</span>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

</template>
