<script setup lang="ts">
import UserLoading from "../components/UserLoading.vue"
import { useUserStore } from "../stores"
import { ref } from "vue"
import AddTask from "../components/AddTask.vue";
import type { Task } from "../typings/user.ts"

const userStore = useUserStore()

const tasks = ref<Task[]>([])

for (const semester of (userStore.user?.semester ?? [])) {
    for (const module of semester.modules) {
        for (const milestone of module.milestones) {
            for (const task of milestone.tasks) {
                tasks.value.push(task)
            }
        }
    }
}

</script>

<template>
  <v-container>
    <UserLoading v-if="userStore.loading" />

    <v-row v-else>
      <v-col cols="12" md="6">
        <v-card title="Upcoming Tasks" prepend-icon="mdi-checkbox-marked-circle-outline">
          <v-divider></v-divider>
          <v-card-text v-if="tasks.length">
            <v-list v-if="tasks.length">
              <v-list-item v-if="tasks.length" v-for="task in tasks" :key="task._id" :title="task.name" :subtitle="task.endDate?.toDateString()">
              </v-list-item>
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
            <v-data-table :items="tasks"></v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
</style>
