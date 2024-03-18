<script setup lang="ts">
import Task from "../components/Task.vue"
import Sidebar from "../components/Sidebar.vue"
import UserLoading from "../components/UserLoading.vue"
import { useUserStore } from "../stores/user.ts"
import Semester from "../components/Semester.vue"

const userStore = useUserStore()

console.log(userStore.user)
</script>

<template>
  <UserLoading v-if="userStore.loading" />

  <v-container v-else>
    <!-- welcome back message -->
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            <span class="title">Welcome back, {{ userStore.user?.name ?? "Unknown" }}</span>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
        <v-col>
            <v-card>
                <v-card-title>
                    <span class="title">Semesters</span>
                </v-card-title>
                <v-card-text>
                    <Semester v-for="sem in userStore.user?.semester" :semester="sem" />
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
  </v-container>

</template>
