<script setup lang="ts">
import UserLoading from "../components/UserLoading.vue";
import { useUserStore } from "../stores";
import AddTask from "../components/AddTask.vue";
import Task from "../components/Task.vue";
import { ref } from "vue";
import type { Task as TaskType } from "../typings/user";
import TaskInfo from "../components/modals/TaskInfo.vue";

const userStore = useUserStore();

const tasks = ref<TaskType[]>(userStore.tasks);
const search = ref<string>("");

const headers = [
  { title: "Title", key: "title", sortable: false },
  { title: "Start Date", key: "startDate" },
  { title: "End Date", key: "endDate" },
  { title: "Status", key: "status" },
  { title: "Hours", key: "hours" },
  { title: "", key: "action", sortable: false },
];

userStore.$subscribe(() => {
  tasks.value = userStore.tasks;
});

const selectedTask = ref<TaskType | null>(null);
const showTaskInfo = ref<boolean>(false);
</script>

<template>
  <v-container>
    <UserLoading v-if="userStore.loading" />

    <v-row v-else>
      <v-col cols="12" md="6">
        <v-card
          title="Upcoming Tasks"
          prepend-icon="mdi-checkbox-marked-circle-outline"
        >
          <v-divider></v-divider>
          <v-card-text>
            <v-list v-if="tasks.length">
              <Task
                v-for="task in userStore.tasks"
                :key="task._id"
                :task="task"
                editable
              />
            </v-list>
            <p v-else class="text-lg mb-4">No tasks found!</p>
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
          <template #text>
            <v-text-field
              v-model="search"
              label="Search"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              hide-details
              single-line
            ></v-text-field>
          </template>
          <v-card-text>
            <v-data-table
              :loading="userStore.loading"
              :items="tasks"
              :headers="headers"
              :search="search"
            >
              <template #item.status="{ item }">
                <v-chip
                  :color="
                    item.status === 'Completed'
                      ? 'success'
                      : item.status === 'In Progress'
                        ? 'warning'
                        : 'error'
                  "
                  :v-model="item.status"
                  dark
                  >{{ item.status }}</v-chip
                >
              </template>
              <template #item.hours="{ item }">
                <v-chip
                  :color="
                    item.hrsCompleted >= item.hrsRequired ? 'success' : 'error'
                  "
                  dark
                  >{{ item.hrsCompleted }} / {{ item.hrsRequired }}</v-chip
                >
              </template>
              <template #item.action="{ item }">
                <v-btn
                  color="primary"
                  variant="text"
                  icon="mdi-pencil"
                  @click="
                    selectedTask = item;
                    showTaskInfo = true;
                  "
                ></v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <TaskInfo
    v-if="selectedTask"
    :task="selectedTask"
    :visible="showTaskInfo"
    :editable="true"
    :close="() => (showTaskInfo = false)"
  />
</template>

<style scoped></style>
