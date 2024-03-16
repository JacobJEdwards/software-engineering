<script setup>
import { useUserStore } from "../stores"
import { ref } from "vue"
import type { Task, Module, Milestone } from "../typings/user"

type TaskForm = {
    title: string
    milestone: string
    startDate: Date | null
    endDate: Date | null
}

const userStore = useUserStore()

const user = userStore.user
const semester = userStore.semester

const modelVisible = ref(false)

const formData = ref<TaskForm>({
    title: "",
    endDate: null,
    startDate: null,
    milestone: "",
})

const selectedModule = ref<Module | null>(null)
const selectedModuleMilestones = ref<Milestone[]>([])

const menu = ref(false)
const startDate = ref(null)
const endDate = ref(null)

const populateMilstones = () => {
    if (selectedModule.value) {
        selectedModuleMilestones.value = selectedModule.value.milestones
    }
}

const createTask = () => {
    console.log(formData.value)
    modelVisible.value = false
}

</script>

<template>
    <v-container>
        <v-dialog v-model="modelVisible" max-width="500px">
            <template v-slot:activator="{ on }">
                <v-btn v-on="on" color="primary">Create Task</v-btn>
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
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field v-model="startDate" label="Date" v-bind="attrs" v-on="on" readonly></v-text-field>
                        </template>
                        <v-date-picker v-model="startDate" no-title scrollable>
                            <v-spacer></v-spacer>
                            <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                            <v-btn text color="primary" @click="menu = false">OK</v-btn>
                        </v-date-picker>
                    </v-menu>
                    <v-menu v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y max-width="290px">
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field v-model="endDate" label="Date" v-bind="attrs" v-on="on" readonly></v-text-field>
                        </template>
                        <v-date-picker v-model="endDate" no-title scrollable>
                            <v-spacer></v-spacer>
                            <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                            <v-btn text color="primary" @click="menu = false">OK</v-btn>
                        </v-date-picker>
                    </v-menu>
                    <v-select v-model="selectedModule" :items="semester.modules" label="Module" @change="populateMilstones"></v-select>
                    <v-select v-model="formData.milestone" :items="selectedModuleMilestones"  label="Milestone">
                    </v-select>
                    <v-btn type="submit" color="primary">Create</v-btn>
                    <v-btn color="primary" @click="modelVisible = false">Cancel</v-btn>
                </v-form>
        </v-card>
</template>

<style scoped>
</style>
