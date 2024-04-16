<script setup lang="ts">
import UserLoading from "../components/UserLoading.vue"
import { useUserStore } from "../stores"
import AddTask from "../components/AddTask.vue";
import Task from "../components/Task.vue";

const userStore = useUserStore()
// split into components
</script>

<template>
  <v-container>
    <UserLoading v-if="userStore.loading" />

    <v-row v-else>
      <v-col cols="12" md="6">
        <v-card title="Upcoming Tasks" prepend-icon="mdi-checkbox-marked-circle-outline">
          <v-divider></v-divider>
          <v-card-text v-if="userStore.tasks.length">
            <v-list v-if="userStore.tasks.length">
              <Task v-for="task in userStore.tasks" :key="task._id" :task="task" small editable />
            </v-list>
          </v-card-text>
          <v-card-text v-else>
            <p class="text-lg mb-4">No tasks found!</p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-row>
          <v-col cols="12">
            <v-card title="Add a task" prepend-icon="mdi-clipboard-outline">
              <v-divider></v-divider>
              <v-card-text>
                <AddTask />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12">
        <v-card title="All tasks" prepend-icon="mdi-dots-horizontal">
          <v-divider></v-divider>
          <v-card-text>
            <v-data-table :loading="userStore.loading" :items="userStore.tasks"></v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
</style>
