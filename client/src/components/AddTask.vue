<script setup lang="ts">
import { useUserStore, useAuthStore } from "../stores"
import { ref } from "vue"
import { useLoading } from "../utils/utils.ts";
import { API_ROUTE} from "../config.ts";

import { Milestone, TaskStatus, TaskStatuses } from "../typings/user"

const { loading } = useLoading()

const TaskStatusSelect = Object.values(TaskStatuses)

type TaskForm = {
    title: string
    milestoneId: string
    startDate: Date | null
    endDate: Date | null
    progress: TaskStatus
    hrsCompleted: number
    hrsRequired: number
}

const userStore = useUserStore()
const authStore = useAuthStore()

// change this
const semester = userStore.user?.semester[0]

const modelVisible = ref<boolean>(false)

/*
const tasks = await Tasks.createTaskByUserId(req.userData.userId, req.body.milestoneId, req.body.tasktitle,
    req.body.startDate, req.body.endDate, req.body.progress, req.body.hrsCompleted, req.body.hrsRequired);
 */


const formData = ref<TaskForm>({
    title: "",
    endDate: null,
    startDate: null,
    milestoneId: "",
    progress: TaskStatuses.STARTED,
    hrsCompleted: 0,
    hrsRequired: 0
})

const persist = ref<boolean>(false)
// on any change to the form, set persist to false
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

const createTask = async () => {
    console.log(formData.value)

  loading.value = true
  try {
      const body = {
          milestoneId: formData.value.milestoneId,
          tasktitle: formData.value.title,
          startDate: formData.value.startDate,
          endDate: formData.value.endDate,
          progress: formData.value.progress,
          hrsCompleted: formData.value.hrsCompleted,
          hrsRequired: formData.value.hrsRequired,
      }

      const response = await fetch(`${API_ROUTE}/protected/task`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": authStore.authToken ?? "",
          },
          body: JSON.stringify(body),
      })

      if (!response.ok) {
          throw new Error("Failed to create task")
      }

      const data = await response.json()
      console.log(data)

      await userStore.getUser()
  } catch (error) {
      console.error(error)
  } finally {
      loading.value = false
  }

  closeForm()
}

const closeForm = () => {
  formData.value = {
    title: "",
    milestoneId: "",
    startDate: null,
    endDate: null,
    progress: TaskStatuses.STARTED,
    hrsCompleted: 0,
    hrsRequired: 0
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
