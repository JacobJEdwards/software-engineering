<script setup lang="ts">
import { useUserStore } from "../stores"
import { ref } from "vue"

import { Module, Milestone, Task } from "../typings/user"

type TaskForm = {
    title: string
    milestone: string
    startDate: Date | null
    endDate: Date | null
}

const userStore = useUserStore()

// change this
const semester = userStore.user?.semester[0]
const moduleSelections = semester?.modules?.map((module) => module.moduleName) ?? []

const modelVisible = ref<boolean>(false)

const formData = ref<TaskForm>({
    title: "",
    endDate: null,
    startDate: null,
    milestone: "",
})

const persist = ref<boolean>(false)
// on any change to the form, set persist to false
const persistForm = () => {
    persist.value = true
}

const selectedModule = ref<Module | null>(null)
const selectedModuleMilestones = ref<Milestone[]>([])

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

const closeForm = () => {
  formData.value = {
    title: "",
    milestone: "",
    startDate: null,
    endDate: null,
  }
    modelVisible.value = false
}

</script>

<template>
    <v-container>
        <v-btn @click="modelVisible = !modelVisible">Add Task</v-btn>
        <v-dialog v-model="modelVisible" max-width="800" class="p-4" :persistent="persist">
            <v-card>
                <v-card-title>
                    <span>Create Task</span>
                </v-card-title>
                <v-card-text>
                    <v-form @change="persistForm">
                        <v-text-field
                            v-model="formData.title"
                            label="Title"
                            outlined
                            required
                            variant="solo-filled"
                        ></v-text-field>
                        <v-select
                            v-model="selectedModule"
                            :items="semester?.modules ?? []"
                            item-title="moduleName"
                            item-value="moduleCode"
                            label="Module"
                            required
                            @change="populateMilestones"
                            variant="solo-filled"
                        ></v-select>
                        <v-select
                            v-if="selectedModule"
                            v-model="formData.milestone"
                            :items="selectedModuleMilestones ?? []"
                            item-title="milestoneName"
                            item-value="milestoneName"
                            label="Milestone"
                            required
                            variant="solo-filled"
                        ></v-select>
                      <v-row class="justify-center items-center">
                        <v-col cols="6" class="">
                          <p class="text-center">Start Date</p>
                          <v-date-picker
                              v-model="startDate"
                              title="Start Date"
                              required
                              hide-header
                          ></v-date-picker>
                        </v-col>
                        <v-col cols="6" class="">
                          <p class="text-center">End Date</p>
                          <v-date-picker
                              v-model="endDate"
                              title="End Date"
                              required
                              hide-header
                          ></v-date-picker>
                        </v-col>
                      </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-btn text="Cancel" @click="closeForm"></v-btn>
                    <v-btn color="primary" @click="createTask">Create</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<style scoped>
</style>
