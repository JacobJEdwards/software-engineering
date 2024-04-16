<script setup lang="ts">
import UserLoading from "../components/UserLoading.vue"
import { useUserStore } from "../stores"
import Semester from "../components/Semester.vue"
import { ref } from "vue"
import type { Task } from "../typings/user.ts"

import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const calendarOptions = ref({
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: "dayGridMonth",
    headerToolbar: {
        left: "prev,next",
        center: "title",
        right: "dayGridMonth",
    },
    editable: false,
    selectable: false,
    selectMirror: false,
    dayMaxEvents: true,
    weekends: true,
    initialEvents: [],
})



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

console.log(userStore.user)

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
              <p class="text-sm text-gray-400">Create a task in the <router-link to="/tasks" class="text-blue-500 text-sm hover:text-blue-700 focus:outline-none">task page.</router-link></p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
            <v-row>
            <v-col cols="12">
              <v-card title="Current Semester" prepend-icon="mdi-clipboard-outline">
                <v-divider></v-divider>
                <v-card-text>
                  <Semester v-if="userStore.user?.semester?.length" :semester="userStore.user?.semester[0]" />
                  <div class="p-4" v-else>
                    <p class="text-lg">No semester found!</p>
                      <div class="my-4">
                        <v-divider class="my-4"></v-divider>
                      </div>
                    <router-link to="/profile" class="text-blue-500 underline text-sm hover:text-blue-700 focus:outline-none">Create a semester</router-link>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
                <v-col cols="12">
                    <v-card title="Calender" prepend-icon="mdi-calendar">
                        <v-divider></v-divider>
                        <v-card-text>
                            <FullCalendar :options="calendarOptions" class="fc" />
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-col>
    </v-row>

</v-container>
</template>

<style scoped>
</style>
