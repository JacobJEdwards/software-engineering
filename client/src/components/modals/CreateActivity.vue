<script setup lang="ts">
import { useAuthStore, useUserStore } from "../../stores";
import { ref, watch } from "vue";
import { ActivitiesService } from "../../services";
import { useLoading, useSuccessErrorMessage } from "../..//utils/utils.ts";
import { TaskStatuses, ActivityForm } from "../../typings/user.ts";

const { loading } = useLoading();
const { success, error } = useSuccessErrorMessage();

const authStore = useAuthStore();
const userStore = useUserStore();

const props = defineProps<
  {
    visible: boolean;
    close: () => void;
  } & Partial<ActivityForm>
>();

const emit = defineEmits(["created"]);

const formData = ref<ActivityForm>({
  activityTitle: props.activityTitle ?? "",
  activityType: props.activityType ?? "",
  activityDescription: props.activityDescription ?? "",
  hrsCompleted: props.hrsCompleted ?? 0,
  tasks: props.tasks ?? [],
});

watch(
  () => props,
  () => {
    formData.value = {
      activityTitle: props.activityTitle ?? "",
      activityType: props.activityType ?? "",
      activityDescription: props.activityDescription ?? "",
      hrsCompleted: props.hrsCompleted ?? 0,
      tasks: props.tasks ?? [],
    };
  },
  { deep: true },
);

const closeForm = () => {
  formData.value = {
    activityTitle: props.activityTitle ?? "",
    activityType: props.activityType ?? "",
    activityDescription: props.activityDescription ?? "",
    hrsCompleted: props.hrsCompleted ?? 0,
    tasks: props.tasks ?? [],
  };
  error.value = "";
  success.value = "";
  loading.value = false;
  props.close();
};

const submitForm = async () => {
  error.value = "";
  success.value = "";
  loading.value = true;

  const result = await ActivitiesService.create(
    authStore.authToken,
    formData.value,
  );

  if (!result.success) {
    error.value = result.error ?? "An error occurred";
    loading.value = false;
    return;
  }

  success.value = "Activity logged successfully";
  loading.value = false;
  await userStore.getUser();
  emit("created");

  closeForm();
};
</script>

<template>
  <v-dialog
    v-model="props.visible"
    max-width="500px"
    scrollable
    @click:outside="props.close"
  >
    <v-card class="p-4">
      <v-card-title class="headline">Log Activity</v-card-title>
      <v-card-text>
        <v-container>
          <v-alert v-if="error" type="error" class="mb-4">{{ error }}</v-alert>
          <v-alert v-if="success" type="success" class="mb-4">{{
            success
          }}</v-alert>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="formData.activityTitle"
                label="Activity Title"
                required
                :loading="loading"
                aria-required="true"
                outlined
                variant="solo-filled"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="formData.activityType"
                label="Activity Type"
                required
                :loading="loading"
                aria-required="true"
                outlined
                variant="solo-filled"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="formData.activityDescription"
                label="Activity Description"
                required
                :loading="loading"
                aria-required="true"
                outlined
                variant="solo-filled"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="formData.hrsCompleted"
                label="Hours Completed"
                required
                :loading="loading"
                aria-required="true"
                outlined
                variant="solo-filled"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="formData.tasks"
                :items="
                  userStore.tasks.filter(
                    (task) => task.status !== TaskStatuses.COMPLETED,
                  )
                "
                item-text="title"
                item-value="_id"
                label="Tasks"
                multiple
                required
                :loading="loading"
                aria-required="true"
                outlined
                variant="solo-filled"
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="error"
          rounded="sm"
          @click="closeForm"
          text="Cancel"
        ></v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="success"
          :loading="loading"
          text="Save"
          rounded="sm"
          @click="submitForm"
          :disabled="
            !formData.activityTitle ||
            !formData.activityType ||
            !formData.activityDescription ||
            !formData.hrsCompleted ||
            !formData.tasks.length
          "
        >
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
