<script setup lang="ts">
import { Task, TaskStatuses, TaskStatus } from "../typings/user"
import { ref } from "vue"
import { useLoading} from "../utils/utils.ts";
import { API_ROUTE } from "../config.ts";
import { useAuthStore, useUserStore } from "../stores";

const { loading } = useLoading()

const authStore = useAuthStore()
const userStore = useUserStore()

const props = defineProps<{
  task: Task
  small?: boolean
  editable?: boolean
}>()

const modelVisible = ref<boolean>(false)

const deleteTask = async () => {
  loading.value = true
  // await Tasks.deleteTaskById(task._id)

  try {
    const taskId = props.task._id

    const response = await fetch(`${API_ROUTE}/protected/task`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authStore.token ?? ""
      },
      body: JSON.stringify({ taskId })
    })


    if (!response.ok) {
      throw new Error("Failed to delete task")
    }

    const data = await response.json()
    console.log(data)

    await userStore.getUser()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

</script>

<template>
  <v-dialog scrollable v-model="modelVisible" max-width="500px" class="p-4" max-height="500px">
    <v-card>
      <v-card-title>
        {{ task.title }}
      </v-card-title>
      <v-card-text v-if="props.editable">
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="task.title" label="Title"></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="task.startDate" label="Start Date"></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="task.endDate" label="End Date"></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-select v-model="task.status" label="Status" :items="Object.values(TaskStatuses)"></v-select>
          </v-col>
          <v-col cols="12">
            <v-text-field hint="Please log an activity to update hours." disabled v-model="task.hrsCompleted"
                          label="Hours Completed"
                          persistent-hint></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="task.hrsRequired" label="Hours Required"></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text v-else>
        <v-list>
          <v-list-item title="Title" :subtitle="task.title"></v-list-item>
          <v-list-item title="Start Date" :subtitle="task.startDate"></v-list-item>
          <v-list-item title="End Date" :subtitle="task.endDate"></v-list-item>
          <v-list-item title="Status" :subtitle="task.status"></v-list-item>
          <v-list-item title="Hours Completed" :subtitle="task.hrsCompleted"></v-list-item>
          <v-list-item title="Hours Required" :subtitle="task.hrsRequired"></v-list-item>
        </v-list>
      </v-card-text>

      <v-card-actions v-if="props.editable">
        <v-btn @click="modelVisible = false">Close</v-btn>
        <v-btn @click="modelVisible = false" color="green">Save</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="deleteTask" color="danger" >Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-list-item v-if="small" :title="task.title" :key="task._id" @click="modelVisible = true"
               class="hover:bg-gray-100 cursor-pointer">
  </v-list-item>
</template>

<style scoped></style>
