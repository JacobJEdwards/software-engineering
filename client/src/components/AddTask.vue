<script setup lang="ts">
import { useUserStore, useAuthStore } from "../stores"
import { ref } from "vue"
import { useLoading, useSuccessErrorMessage } from "../utils/utils.ts";
import { TaskService } from "../services/tasks.ts";

import { Milestone, TaskStatuses, TaskForm } from "../typings/user"

const { loading } = useLoading()
const { error, success } = useSuccessErrorMessage()
const TaskStatusSelect = Object.values(TaskStatuses)

const userStore = useUserStore()
const authStore = useAuthStore()

const semester = userStore.user?.semester[0]

const modelVisible = ref<boolean>(false)

const formData = ref<TaskForm>({
    title: "",
    milestoneId: "",
    progress: TaskStatuses.STARTED,
    hrsCompleted: 0,
    hrsRequired: 0
})

const persist = ref<boolean>(false)

const persistForm = () => {
    persist.value = true
}

const selectedModule = ref<string | null>(null)
const selectedModuleMilestones = ref<Milestone[]>([])

const populateMilestones = () => {
    if (selectedModule.value) {
        const selected = semester?.modules.find((module) => module._id === selectedModule.value)
        if (!selected) return

        selectedModuleMilestones.value = selected.milestones
    }
}

const closeForm = () => {
  formData.value = {
    title: "",
    milestoneId: "",
    startDate: undefined,
    endDate: undefined,
    progress: TaskStatuses.STARTED,
    hrsCompleted: 0,
    hrsRequired: 0
  }
  modelVisible.value = false
  loading.value = false
  success.value = ""
  error.value = ""
}

const createTask = async () => {
  loading.value = true
  success.value = ""
  error.value = ""

    const newTask = {
      title: formData.value.title,
      milestoneId: formData.value.milestoneId,
      startDate: formData.value.startDate,
      endDate: formData.value.endDate,
      progress: formData.value.progress,
      hrsCompleted: formData.value.hrsCompleted,
      hrsRequired: formData.value.hrsRequired
    }

      const result = await TaskService.create(newTask, authStore.authToken);

    if (result.success) {
      success.value = "Task created successfully"
      await userStore.getUser()
      modelVisible.value = false
      closeForm()
    } else {
      error.value = "Failed to create task"
    }

    loading.value = false
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
                        <v-alert v-if="error" type="error" class="mb-4">{{ error }}</v-alert>
                        <v-alert v-if="success" type="success" class="mb-4">{{ success }}</v-alert>

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
                            item-value="_id"
                            label="Module"
                            required
                            variant="solo-filled"
                            @update:model-value="populateMilestones"
                        ></v-select>
                        <v-select
                            v-if="selectedModule"
                            v-model="formData.milestoneId"
                            :items="selectedModuleMilestones ?? []"
                            item-title="milestoneTitle"
                            item-value="_id"
                            label="Milestone"
                            required
                            variant="solo-filled"
                        ></v-select>
                      <v-row class="justify-center items-center">
                        <v-col cols="6" class="">
                          <p class="text-center">Start Date</p>
                          <v-date-picker
                              v-model="formData.startDate"
                              title="Start Date"
                              required
                              hide-header
                          ></v-date-picker>
                        </v-col>
                        <v-col cols="6" class="">
                          <p class="text-center">End Date</p>
                          <v-date-picker
                              v-model="formData.endDate"
                              title="End Date"
                              required
                              hide-header
                          ></v-date-picker>
                        </v-col>
                      </v-row>
                        <v-select
                            v-model="formData.progress"
                            :items="TaskStatusSelect"
                            label="Progress"
                            required
                            variant="solo-filled"
                        ></v-select>
                        <v-text-field
                            v-model="formData.hrsCompleted"
                            label="Hours Completed"
                            outlined
                            required
                            variant="solo-filled"
                        ></v-text-field>
                        <v-text-field
                            v-model="formData.hrsRequired"
                            label="Hours Required"
                            outlined
                            required
                            variant="solo-filled"
                        ></v-text-field>
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
