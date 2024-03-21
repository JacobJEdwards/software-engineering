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

// just basic calendar options for now, no edit, no drag and drop, no nothing, no header
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

</script>

<template>
<v-container>
    <UserLoading v-if="userStore.loading" />

    <v-row v-else>
        <v-col cols="12" md="6">
            <v-card>
                <v-card-title>Current Semester</v-card-title>
                <v-card-text>
                    <Semester v-if="userStore.user?.semester?.length" :semester="userStore.user?.semester[0]" />
                    <span v-else>No semester found</span>
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="12" md="6">
            <v-row>
            <v-col cols="12">
                <v-card>
                    <v-card-title>Upcoming Tasks</v-card-title>
                    <v-card-text>
                        <v-list>
                            <v-list-item v-if="tasks.length" v-for="task in tasks" :key="task._id" :title="task.name" :subtitle="task.endDate?.toDateString()">
                            </v-list-item>
                            <v-list-item v-else title="No tasks!"></v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-col>
                <v-col cols="12">
                    <v-card>
                        <v-card-title>Calender</v-card-title>
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
