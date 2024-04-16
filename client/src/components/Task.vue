<script setup lang="ts">
import {Task, TaskStatuses, TaskStatus} from "../typings/user"
import {ref} from "vue"
import {useLoading, useSuccessErrorMessage} from "../utils/utils.ts";
import {useAuthStore, useUserStore} from "../stores";
import { TaskService } from "../services/tasks.ts";

const { success, error } = useSuccessErrorMessage()

const {loading} = useLoading()

const authStore = useAuthStore()
const userStore = useUserStore()

type TaskForm = {
  title: string
  startDate: string
  endDate: string
  status: TaskStatus
  hrsCompleted: number
  hrsRequired: number
}

const props = defineProps<{
  task: Task
  small?: boolean
  editable?: boolean
}>()

const formData = ref<TaskForm>(<TaskForm>{
  title: props.task.title,
  startDate: props.task.startDate,
  endDate: props.task.endDate,
  status: props.task.status,
  hrsCompleted: props.task.hrsCompleted,
  hrsRequired: props.task.hrsRequired
})


const modelVisible = ref<boolean>(false)
const edit = ref<boolean>(false)

const deleteTask = async () => {
  success.value = ""
  error.value = ""
  loading.value = true

  const taskId = props.task._id
  const result = await TaskService.delete(taskId, authStore.authToken)

  if (result.success) {
    success.value = "Task deleted successfully"
    await userStore.getUser()
    modelVisible.value = false
  } else {
    error.value = "Failed to delete task"
  }

  loading.value = false
}

const updateTask = async () => {
  success.value = ""
  error.value = ""

  if (!edit.value) {
    edit.value = true
    return
  }

  loading.value = true
    const taskId = props.task._id
    const body = {
      taskId,
      milestoneId: "",
      title: formData.value.title,
      startDate: formData.value.startDate,
      endDate: formData.value.endDate,
      progress: formData.value.status,
      hrsCompleted: formData.value.hrsCompleted,
      hrsRequired: formData.value.hrsRequired
    }

    const result = await TaskService.update(body, authStore.authToken)

  if (result.success) {
    success.value = "Task updated successfully"
    await userStore.getUser()
    modelVisible.value = false
  } else {
    error.value = "Failed to update task"
  }

  loading.value = false
}


</script>

<template>
  <v-dialog scrollable v-model="modelVisible" max-width="500px" class="p-4" max-height="500px">
    <v-card>
      <v-card-title>
        {{ task.title }}
      </v-card-title>
      <v-card-text v-if="props.editable && edit">
        <v-row>
          <v-col cols="12" v-if="error || success">
            <v-alert v-if="error" type="error">{{ error }}</v-alert>
            <v-alert v-if="success" type="success">{{ success }}</v-alert>
          </v-col>
          <v-col cols="12">
            <v-text-field :loading="loading" v-model="formData.title" label="Title"></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field :loading="loading" v-model="formData.startDate" label="Start Date"></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field :loading="loading" v-model="formData.endDate" label="End Date"></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-select :loading="loading" v-model="formData.status" label="Status"
                      :items="Object.values(TaskStatuses)"></v-select>
          </v-col>
          <v-col cols="12">
            <v-text-field :loading="loading" hint="Please log an activity to update hours." disabled
                          v-model="task.hrsCompleted"
                          label="Hours Completed"
                          persistent-hint></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field :loading="loading" v-model="formData.hrsRequired" label="Hours Required"></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text v-else>
        <v-row>
          <v-col cols="12">
            <v-list-item title="Title" :key="task._id" :subtitle="task.title"></v-list-item>
          </v-col>
          <v-col cols="12">
            <v-list-item title="Start Date" :key="task._id" :subtitle="task.startDate"></v-list-item>
          </v-col>
          <v-col cols="12">
            <v-list-item title="End Date" :key="task._id" :subtitle="task.endDate"></v-list-item>
          </v-col>
          <v-col cols="12">
            <v-list-item title="Status" :key="task._id" :subtitle="task.status"></v-list-item>
          </v-col>
          <v-col cols="12">
            <v-list-item title="Hours Completed" :key="task._id" :subtitle="task.hrsCompleted"></v-list-item>
          </v-col>
          <v-col cols="12">
            <v-list-item title="Hours Required" :key="task._id" :subtitle="task.hrsRequired"></v-list-item>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions v-if="props.editable">
        <v-btn :loading="loading" @click="edit ? edit = false : modelVisible = false" color="blue">
          {{ edit ? "Cancel" : "Close" }}
        </v-btn>

        <v-btn @click="updateTask" :loading="loading" color="green">
          {{ edit ? "Save" : "Edit" }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn :loading="loading" @click="deleteTask" color="danger">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-list-item v-if="small" :title="task.title" :key="task._id" @click="modelVisible = true"
               class="hover:bg-gray-100 cursor-pointer">
  </v-list-item>
</template>

<style scoped></style>
