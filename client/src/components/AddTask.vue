<script setup lang="ts">
import { useUserStore, useAuthStore } from "../stores";
import { ref } from "vue";
import { useLoading, useSuccessErrorMessage } from "../utils/utils.ts";
import { TaskService } from "../services";
import { Milestone, TaskStatuses, TaskForm } from "../typings/user";

const modelVisible = ref<boolean>(false);

const { loading } = useLoading();
const { error, success } = useSuccessErrorMessage();
const TaskStatusSelect = Object.values(TaskStatuses);

const userStore = useUserStore();
const authStore = useAuthStore();

const semester = userStore.user?.semester[0];

const formData = ref<TaskForm>({
  title: "",
  milestoneId: "",
  progress: TaskStatuses.STARTED,
  hrsCompleted: 0,
  hrsRequired: 0,
});

const selectedModule = ref<string | null>(null);
const selectedModuleMilestones = ref<Milestone[]>([]);

const populateMilestones = () => {
  if (selectedModule.value) {
    const selected = semester?.modules.find(
      (module) => module._id === selectedModule.value,
    );
    if (!selected) return;

    selectedModuleMilestones.value = selected.milestones;
  }
};

const closeForm = () => {
  formData.value = {
    title: "",
    milestoneId: "",
    startDate: undefined,
    endDate: undefined,
    progress: TaskStatuses.STARTED,
    hrsCompleted: 0,
    hrsRequired: 0,
  };
  loading.value = false;
  success.value = "";
  error.value = "";
  modelVisible.value = false;
};

const createTask = async () => {
  loading.value = true;
  success.value = "";
  error.value = "";

  const newTask = {
    title: formData.value.title,
    milestoneId: formData.value.milestoneId,
    startDate: formData.value.startDate,
    endDate: formData.value.endDate,
    progress: formData.value.progress,
    hrsCompleted: formData.value.hrsCompleted,
    hrsRequired: formData.value.hrsRequired,
  };

  const result = await TaskService.create(newTask, authStore.authToken);

  if (result.success) {
    success.value = "Task created successfully";
    await userStore.getUser();
    closeForm();
  } else {
    error.value = result.error ?? "Error creating task";
  }

  loading.value = false;
};
</script>

<template>
  <v-container>
    <v-btn
      @click="modelVisible = !modelVisible"
      color="grey-darken-4"
      rounded="md"
      block
      >Add Task</v-btn
    >
    <v-dialog v-model="modelVisible" max-width="800" scrollable>
      <v-card class="p-4">
        <v-card-title class="headline">Create Task</v-card-title>
        <v-form @submit.prevent="createTask">
          <v-card-text>
            <v-container>
              <v-alert v-if="error" type="error" class="mb-4">{{
                error
              }}</v-alert>
              <v-alert v-if="success" type="success" class="mb-4">{{
                success
              }}</v-alert>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="formData.title"
                    label="Title"
                    outlined
                    required
                    variant="solo-filled"
                    aria-required="true"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
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
                </v-col>
                <v-col cols="12">
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
                </v-col>
              </v-row>

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
              <v-row>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="formData.progress"
                    :items="TaskStatusSelect"
                    label="Progress"
                    required
                    variant="solo-filled"
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="formData.hrsCompleted"
                    label="Hours Completed"
                    outlined
                    required
                    variant="solo-filled"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="formData.hrsRequired"
                    label="Hours Required"
                    outlined
                    required
                    variant="solo-filled"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              text="Cancel"
              color="blue darken-1"
              @click="closeForm"
            ></v-btn>
            <v-btn
              color="blue darken-1"
              text="Create"
              type="submit"
              :loading="loading"
            ></v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped></style>
