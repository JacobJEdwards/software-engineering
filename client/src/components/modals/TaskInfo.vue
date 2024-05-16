<script setup lang="ts">
import { TaskStatuses, Task } from "../../typings/user.ts";
import { useLoading, useSuccessErrorMessage } from "../../utils/utils.ts";
import { computed, ref, watch } from "vue";
import { TaskService } from "../../services";
import { useAuthStore, useUserStore } from "../../stores";
import Alert from "../utils/Alert.vue";
import NumberInput from "../utils/NumberInput.vue";
import ConfirmModal from "./ConfirmModal.vue";
import type { TaskForm } from "../../typings/user";

const { loading } = useLoading();
const { success, error } = useSuccessErrorMessage();

const show = defineModel("show", {
  type: Boolean,
  default: false,
});

const authStore = useAuthStore();
const userStore = useUserStore();

const props = defineProps<{
  task: Task;
  editable: boolean;
  close: () => void;
}>();

const formData = ref<TaskForm>({
  title: props.task.title,
  startDate: new Date(props.task.startDate),
  endDate: new Date(props.task.endDate),
  progress: props.task.status,
  hrsCompleted: props.task.hrsCompleted,
  hrsRequired: props.task.hrsRequired,
  milestoneId: "",
  dependantTasks: props.task.dependantTasks,
});

const edit = ref<boolean>(false);
const deletePressed = ref<boolean>(false);
const possibleDependantTasks = computed(() => {
  return userStore.tasks.filter(
    (task) =>
      task._id !== props.task._id &&
      !task.dependantTasks.includes(props.task._id),
  );
});

const currentDependantTasks = computed(() => {
  return userStore.tasks.filter((task) =>
    props.task.dependantTasks.includes(task._id),
  );
});

const selectedTask = ref<Task | null>(null);
const showTaskInfo = ref<boolean>(false);
const closeTaskInfo = () => {
  selectedTask.value = null;
  showTaskInfo.value = false;
};

const closeForm = () => {
  formData.value = {
    title: props.task.title,
    startDate: props.task.startDate,
    endDate: props.task.endDate,
    progress: props.task.status,
    hrsCompleted: props.task.hrsCompleted,
    hrsRequired: props.task.hrsRequired,
    milestoneId: "",
    dependantTasks: props.task.dependantTasks,
  };
  error.value.message = "";
  error.value.show = false;
  success.value.message = "";
  success.value.show = false;

  loading.value = false;
  edit.value = false;
  props.close();
};

const deleteTask = async () => {
  success.value.message = "";
  success.value.show = false;
  error.value.message = "";
  error.value.show = false;
  loading.value = true;

  const taskId = props.task._id;
  const result = await TaskService.delete(taskId, authStore.authToken);

  if (result.success) {
    success.value.message = "Task deleted successfully";
    success.value.show = true;
    await userStore.getUser();
    closeForm();
  } else {
    error.value.message = result.error ?? "Failed to delete task";
    error.value.show = true;
  }

  loading.value = false;
};

const updateTask = async () => {
  success.value.message = "";
  success.value.show = false;
  error.value.message = "";
  error.value.show = false;

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
    progress: formData.value.progress,
    hrsCompleted: formData.value.hrsCompleted,
    hrsRequired: formData.value.hrsRequired,
    dependantTasks: formData.value.dependantTasks,
  };

  const result = await TaskService.update(body, authStore.authToken);

  if (result.success) {
    await userStore.getUser();
    success.value.message = "Task updated successfully";
    success.value.show = true;
    closeForm();
  } else {
    error.value.message = result.error ?? "Failed to update task";
    error.value.show = true;
  }

  loading.value = false;
};

watch(
  () => props,
  () => {
    formData.value = {
      title: props.task.title,
      startDate: new Date(props.task.startDate),
      endDate: new Date(props.task.endDate),
      progress: props.task.status,
      hrsCompleted: props.task.hrsCompleted,
      hrsRequired: props.task.hrsRequired,
      milestoneId: "",
      dependantTasks: props.task.dependantTasks,
    };
  },
  { deep: true },
);
</script>

<template>
  <v-dialog
    scrollable
    v-model="show"
    max-width="800px"
    class="p-4"
    max-height="600px"
    @click:outside="props.close"
  >
    <v-card>
      <v-card-title class="d-flex justify-space-between">
        <span class="headline">Task Info</span>
        <v-btn icon="mdi-close" variant="text" @click="props.close"></v-btn>
      </v-card-title>

      <v-card-text v-if="props.editable && edit">
        <v-row>
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
          <v-col cols="6">
            <p class="text-center">Start Date</p>
            <v-date-picker
              :loading="loading"
              v-model="formData.startDate"
              label="Start Date"
              aria-required="true"
              hide-header
            ></v-date-picker>
          </v-col>
          <v-col cols="6">
            <p class="text-center">End Date</p>
            <v-date-picker
              :loading="loading"
              v-model="formData.endDate"
              label="End Date"
              aria-required="true"
              hide-header
            ></v-date-picker>
          </v-col>
          <v-col cols="12">
            <v-select
              :loading="loading"
              v-model="formData.progress"
              label="Status"
              :items="Object.values(TaskStatuses)"
              aria-required="true"
              variant="solo-filled"
            ></v-select>
          </v-col>
          <v-col cols="12">
            <NumberInput
              persistent-hint
              hint="Please log an activity to update hours."
              :loading="loading"
              v-model="formData.hrsCompleted"
              label="Hours Completed"
              disabled
            />
          </v-col>
          <v-col cols="12">
            <NumberInput
              label="Hours Required"
              v-model="formData.hrsRequired"
              :min="0"
              required
            />
          </v-col>
          <v-col cols="12">
            <v-select
              :loading="loading"
              v-model="formData.dependantTasks"
              label="Dependant Tasks"
              multiple
              :items="possibleDependantTasks"
              item-title="title"
              item-value="_id"
              aria-required="true"
              variant="solo-filled"
            ></v-select>
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
              title="Hours"
              :key="task._id"
              :subtitle="`${task.hrsCompleted}/${task.hrsRequired}`"
            ></v-list-item>
          </v-col>
          <v-col cols="12">
            <v-list-item
              title="Dependant Tasks"
              :key="task._id"
              :subtitle="task.dependantTasks.length"
            ></v-list-item>
            <v-list-item
              v-for="task in currentDependantTasks"
              :key="task._id"
              :subtitle="task.title"
            >
              <template #append>
                <v-btn
                  icon="mdi-information-outline"
                  variant="text"
                  @click="
                    selectedTask = task;
                    showTaskInfo = true;
                  "
                >
                </v-btn>
              </template>
            </v-list-item>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions v-if="props.editable">
        <v-btn @click="edit = !edit" color="primary">
          {{ edit ? "Cancel" : "Edit" }}
        </v-btn>
        <v-btn
          v-if="props.editable"
          @click="deletePressed = true"
          color="error"
          :loading="loading"
        >
          Delete
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          v-if="edit"
          color="success"
          @click="updateTask"
          :loading="loading"
        >
          Save
        </v-btn>
      </v-card-actions>
      <Alert
        type="error"
        v-model:show="error.show"
        :message="error.message"
        :close="() => (error.show = false)"
      />
      <Alert
        type="success"
        v-model:show="success.show"
        :message="success.message"
        :close="() => (success.show = false)"
      />
    </v-card>
  </v-dialog>
  <ConfirmModal
    v-model:show="deletePressed"
    text="Are you sure you want to delete this task?"
    @confirm="deleteTask"
    @cancel="deletePressed = false"
  />
  <TaskInfo
    v-if="selectedTask"
    :task="selectedTask"
    editable
    :close="closeTaskInfo"
    v-model:show="showTaskInfo"
  />
</template>

<style scoped></style>
