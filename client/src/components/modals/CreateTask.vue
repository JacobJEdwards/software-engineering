<script setup lang="ts">
import { ref, watch } from "vue";
import { TaskService } from "../../services";

import { Milestone, TaskStatuses, TaskForm } from "../../typings/user";
import { useLoading, useSuccessErrorMessage } from "../../utils/utils.ts";
import { useAuthStore, useUserStore } from "../../stores";
import Alert from "../utils/Alert.vue";
import NumberInput from "../utils/NumberInput.vue";

const { loading } = useLoading();
const { error, success } = useSuccessErrorMessage();
const TaskStatusSelect = Object.values(TaskStatuses);

const userStore = useUserStore();
const authStore = useAuthStore();

const show = defineModel("show", {
  type: Boolean,
  default: false,
});

const semester = userStore.currentSemester;

const props = defineProps<
  {
    close: () => void;
  } & Partial<TaskForm>
>();

const emit = defineEmits(["created"]);

const formData = ref<TaskForm>({
  title: props.title ?? "",
  milestoneId: props.milestoneId ?? "",
  progress: props.progress ?? TaskStatuses.STARTED,
  hrsCompleted: props.hrsCompleted ?? 0,
  hrsRequired: props.hrsRequired ?? 0,
  startDate: props.startDate ?? new Date(Date.now()),
  dependantTasks: props.dependantTasks ?? [],
  endDate: props.endDate ?? undefined,
});

// if props change, update form data
watch(
  () => props,
  () => {
    formData.value = {
      title: props.title ?? "",
      milestoneId: props.milestoneId ?? "",
      progress: props.progress ?? TaskStatuses.STARTED,
      hrsCompleted: props.hrsCompleted ?? 0,
      hrsRequired: props.hrsRequired ?? 0,
      startDate: props.startDate ?? new Date(Date.now()),
      dependantTasks: props.dependantTasks ?? [],
      endDate: props.endDate ?? undefined,
    };
  },
  { deep: true },
);

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
    title: props.title ?? "",
    milestoneId: props.milestoneId ?? "",
    startDate: props.startDate ?? undefined,
    endDate: props.endDate ?? undefined,
    progress: props.progress ?? TaskStatuses.STARTED,
    dependantTasks: props.dependantTasks ?? [],
    hrsCompleted: props.hrsCompleted ?? 0,
    hrsRequired: props.hrsRequired ?? 0,
  };
  loading.value = false;
  success.value.message = "";
  success.value.show = false;
  error.value.message = "";
  error.value.show = false;
  props.close();
};

const createTask = async () => {
  loading.value = true;
  success.value.message = "";
  success.value.show = false;
  error.value.message = "";
  error.value.show = false;

  const newTask = {
    title: formData.value.title,
    milestoneId: formData.value.milestoneId,
    startDate: formData.value.startDate,
    endDate: formData.value.endDate,
    progress: formData.value.progress,
    hrsCompleted: formData.value.hrsCompleted,
    dependantTasks: formData.value.dependantTasks,
    hrsRequired: formData.value.hrsRequired,
  };

  const result = await TaskService.create(newTask, authStore.authToken);

  if (result.success) {
    await userStore.getUser();
    success.value.message = "Task created successfully";
    success.value.show = true;
    emit("created");
    closeForm();
  } else {
    error.value.message = result.error ?? "Error creating task";
    error.value.show = true;
  }

  loading.value = false;
};
</script>

<template>
  <v-dialog
    v-model="show"
    max-width="800"
    scrollable
    @click:outside="props.close"
  >
    <v-card class="p-4">
      <v-card-title class="headline">Create Task</v-card-title>
      <v-card-text>
        <v-container>
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
                :disabled="!selectedModule"
                v-model="formData.milestoneId"
                :items="selectedModuleMilestones ?? []"
                item-title="milestoneTitle"
                item-value="_id"
                label="Milestone"
                required
                aria-required="true"
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
                aria-required="true"
              ></v-date-picker>
            </v-col>
            <v-col cols="6" class="">
              <p class="text-center">End Date</p>
              <v-date-picker
                v-model="formData.endDate"
                title="End Date"
                required
                hide-header
                aria-required="true"
              ></v-date-picker>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
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
              <NumberInput
                v-model:value="formData.hrsCompleted"
                label="Hours Completed"
                :min="0"
                required
              ></NumberInput>
            </v-col>
            <v-col cols="12" sm="6">
              <NumberInput
                v-model:value="formData.hrsRequired"
                label="Hours Required"
                :min="0"
                required
              ></NumberInput>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <slot
          name="actions"
          :close="closeForm"
          :create="createTask"
          :formData="formData"
        >
          <v-btn
            text="Cancel"
            color="error"
            @click="closeForm"
            rounded="sm"
          ></v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="success"
            text="Create"
            rounded="sm"
            class="mx-4"
            :loading="loading"
            @click="createTask"
            :disabled="
              !formData.title ||
              !formData.milestoneId ||
              !formData.startDate ||
              !formData.endDate ||
              !formData.progress ||
              !formData.hrsRequired
            "
          ></v-btn>
        </slot>
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
</template>
