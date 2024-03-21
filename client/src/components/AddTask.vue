<script setup lang="ts">
import { useUserStore } from "../stores"
import { ref } from "vue"

import { Module, Milestone } from "../typings/user"

type TaskForm = {
    title: string
    milestone: string
    startDate: Date | null
    endDate: Date | null
}

const userStore = useUserStore()

// change this
const semester = userStore.user?.semester[0]

const modelVisible = ref<boolean>(false)

const formData = ref<TaskForm>({
    title: "",
    endDate: null,
    startDate: null,
    milestone: "",
})

const selectedModule = ref<Module | null>(null)
const selectedModuleMilestones = ref<Milestone[]>([])

const menu = ref<boolean>(false)
const startDate = ref<Date | null>(null)
const endDate = ref<Date | null>(null)

const populateMilestones = () => {
    if (selectedModule.value) {
        selectedModuleMilestones.value = selectedModule.value.milestones
    }
}

const createTask = () => {
    modelVisible.value = false
}

</script>

<template>
    <v-container>
        <v-dialog v-model="modelVisible" max-width="500px">
            <template v-slot:activator="{ isActive }">
                <v-btn v-on="isActive" color="primary">Create Task</v-btn>
            </template>
        </v-dialog>
        <v-card>
            <v-card-title>
                <span class="headline"> Create Task </span>
            </v-card-title>
            <v-card-text>
                <v-form @submit.prevent="createTask">
                    <v-text-field v-model="formData.title" label="Title"></v-text-field>
                    <v-menu v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px">
                        <template v-slot:activator="{ isActive, props }">
                            <v-text-field v-model="startDate" label="Date" v-bind="props" v-on="isActive" readonly></v-text-field>
                        </template>
                        <v-date-picker v-model="startDate" no-title scrollable>
                            <v-spacer></v-spacer>
                            <v-btn text="Cancel" color="primary" @click="menu = false"></v-btn>
                            <v-btn text="OK" color="primary" @click="menu = false"></v-btn>
                        </v-date-picker>
                    </v-menu>
                    <v-menu v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px">
                        <template v-slot:activator="{ isActive, props }">
                            <v-text-field v-model="endDate" label="Date" v-bind="props" v-on="isActive" readonly></v-text-field>
                        </template>
                        <v-date-picker v-model="endDate" no-title scrollable>
                            <v-spacer></v-spacer>
                            <v-btn text="Cancel" color="primary" @click="menu = false"></v-btn>
                            <v-btn text="OK" color="primary" @click="menu = false"></v-btn>
                        </v-date-picker>
                    </v-menu>
                    <v-select v-model="selectedModule" :items="semester?.modules ?? []" label="Module" @change="populateMilestones"></v-select>
                    <v-select v-model="formData.milestone" :items="selectedModuleMilestones"  label="Milestone">
                    </v-select>
                    <v-btn type="submit" color="primary">Create</v-btn>
                    <v-btn color="primary" @click="modelVisible = false">Cancel</v-btn>
                </v-form>
                </v-card-text>
        </v-card>
        </v-container>
</template>

<style scoped>
</style>
