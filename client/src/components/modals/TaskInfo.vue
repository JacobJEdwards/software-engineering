<script setup lang="ts">
import { TaskStatuses, Task, TaskStatus } from "../../typings/user.ts";
import { useLoading, useSuccessErrorMessage } from "../../utils/utils.ts";
import { ref } from "vue";
import { TaskService } from "../../services";
import { useAuthStore, useUserStore } from "../../stores";

const { loading } = useLoading();
const { success, error } = useSuccessErrorMessage();

const authStore = useAuthStore();
const userStore = useUserStore();

type TaskForm = {
  title: string;
  startDate: string | Date;
  endDate: string | Date;
  status: TaskStatus;
  hrsCompleted: number;
  hrsRequired: number;
};

const props = defineProps<{
  task: Task;
  editable: boolean;
  visible: boolean;
  close: () => void;
}>();

const formData = ref<TaskForm>({
  title: props.task.title,
  startDate: props.task.startDate,
  endDate: props.task.endDate,
  status: props.task.status,
  hrsCompleted: props.task.hrsCompleted,
  hrsRequired: props.task.hrsRequired,
});

const edit = ref<boolean>(false);

const closeForm = () => {
  formData.value = {
    title: props.task.title,
    startDate: props.task.startDate,
    endDate: props.task.endDate,
    status: props.task.status,
    hrsCompleted: props.task.hrsCompleted,
    hrsRequired: props.task.hrsRequired,
  };
  error.value = "";
  success.value = "";
  loading.value = false;
  props.close();
};

const deleteTask = async () => {
  success.value = "";
  error.value = "";
  loading.value = true;

  const taskId = props.task._id;
  const result = await TaskService.delete(taskId, authStore.authToken);

  if (result.success) {
    success.value = "Task deleted successfully";
    await userStore.getUser();
    props.close();
  } else {
    error.value = result.error ?? "Failed to delete task";
  }

  loading.value = false;
};

const updateTask = async () => {
  success.value = "";
  error.value = "";

  if (!edit.value) {
    edit.value = true;
    return;
  }

  loading.value = true;
  const taskId = props.task._id;
  const body = {
    taskId,
    milestoneId: "",
    title: formData.value.title,
    startDate: formData.value.startDate,
    endDate: formData.value.endDate,
    progress: formData.value.status,
    hrsCompleted: formData.value.hrsCompleted,
    hrsRequired: formData.value.hrsRequired,
  };

  const result = await TaskService.update(body, authStore.authToken);

  if (result.success) {
    success.value = "Task updated successfully";
    await userStore.getUser();
    props.close();
  } else {
    error.value = result.error ?? "Failed to update task";
  }

  loading.value = false;
};
</script>

<template>
  <v-dialog
    scrollable
    v-model="props.visible"
    max-width="500px"
    class="p-4"
    max-height="500px"
    @click:outside="props.close"
  >
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
            <v-text-field
              :loading="loading"
              v-model="formData.title"
              label="Title"
              aria-required="true"
              outlined
              variant="solo-filled"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              :loading="loading"
              v-model="formData.startDate"
              label="Start Date"
              aria-required="true"
              outlined
              variant="solo-filled"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              :loading="loading"
              v-model="formData.endDate"
              label="End Date"
              aria-required="true"
              outlined
              variant="solo-filled"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-select
              :loading="loading"
              v-model="formData.status"
              label="Status"
              :items="Object.values(TaskStatuses)"
              aria-required="true"
              outlined
              variant="solo-filled"
            ></v-select>
          </v-col>
          <v-col cols="12">
            <v-text-field
              :loading="loading"
              hint="Please log an activity to update hours."
              disabled
              v-model="task.hrsCompleted"
              label="Hours Completed"
              persistent-hint
              aria-required="true"
              outlined
              variant="solo-filled"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              :loading="loading"
              v-model="formData.hrsRequired"
              label="Hours Required"
              aria-required="true"
              outlined
              variant="solo-filled"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text v-else>
        <v-row>
          <v-col cols="12">
            <v-list-item
              title="Title"
              :key="task._id"
              :subtitle="task.title"
            ></v-list-item>
          </v-col>
          <v-col cols="12">
            <v-list-item
              title="Start Date"
              :key="task._id"
              :subtitle="new Date(task.startDate).toDateString()"
            ></v-list-item>
          </v-col>
          <v-col cols="12">
            <v-list-item
              title="End Date"
              :key="task._id"
              :subtitle="new Date(task.endDate).toDateString()"
            ></v-list-item>
          </v-col>
          <v-col cols="12">
            <v-list-item
              title="Status"
              :key="task._id"
              :subtitle="task.status"
            ></v-list-item>
          </v-col>
          <v-col cols="12">
            <v-list-item
              title="Hours Completed"
              :key="task._id"
              :subtitle="task.hrsCompleted"
            ></v-list-item>
          </v-col>
          <v-col cols="12">
            <v-list-item
              title="Hours Required"
              :key="task._id"
              :subtitle="task.hrsRequired"
            ></v-list-item>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions v-if="props.editable">
        <v-btn
          :loading="loading"
          @click="edit ? (edit = false) : closeForm()"
          color="error"
          rounded="sm"
        >
          {{ edit ? "Cancel" : "Close" }}
        </v-btn>

        <v-btn
          @click="updateTask"
          :loading="loading"
          color="success"
          rounded="sm"
        >
          {{ edit ? "Save" : "Edit" }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          :loading="loading"
          @click="deleteTask"
          color="danger"
          rounded="sm"
          >Delete</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
