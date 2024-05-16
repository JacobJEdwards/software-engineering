<script setup lang="ts">
import { useAuthStore, useUserStore } from "../../stores";
import { ref, watch } from "vue";
import { ActivitiesService } from "../../services";
import { useLoading, useSuccessErrorMessage } from "../..//utils/utils.ts";
import {
  TaskStatuses,
  ActivityForm,
  ActivityTypes,
} from "../../typings/user.ts";
import Alert from "../utils/Alert.vue";
import NumberInput from "../utils/NumberInput.vue";

const { loading } = useLoading();
const { success, error } = useSuccessErrorMessage();

const authStore = useAuthStore();
const userStore = useUserStore();

const show = defineModel("show", {
  type: Boolean,
  default: false,
});

const props = defineProps<
  {
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
    console.log(props);
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

  error.value.message = "";
  success.value.message = "";
  error.value.show = false;
  success.value.show = false;

  loading.value = false;
  props.close();
};

const submitForm = async () => {
  error.value.message = "";
  success.value.message = "";
  error.value.show = false;
  success.value.show = false;

  loading.value = true;

  const result = await ActivitiesService.create(
    authStore.authToken,
    formData.value,
  );

  if (!result.success) {
    error.value.message = result.error ?? "An error occurred";
    error.value.show = true;
    loading.value = false;
    return;
  }

  success.value.message = "Activity logged successfully";
  success.value.show = true;

  loading.value = false;
  await userStore.getUser();
  emit("created");

  closeForm();
};
</script>

<template>
  <v-dialog
    v-model="show"
    max-width="500px"
    scrollable
    @click:outside="props.close"
  >
    <v-card class="p-4">
      <v-card-title class="headline">Log Activity</v-card-title>
      <v-card-text>
        <v-container>
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
              <v-select
                v-model="formData.activityType"
                :items="Object.values(ActivityTypes) as string[]"
                label="Activity Type"
                required
                :loading="loading"
                aria-required="true"
                outlined
                variant="solo-filled"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="formData.activityDescription"
                label="Notes"
                required
                :loading="loading"
                aria-required="true"
                outlined
                variant="solo-filled"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <NumberInput
                label="Hours Completed"
                v-model="formData.hrsCompleted"
                :min="0"
                required
              />
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

<style scoped></style>
