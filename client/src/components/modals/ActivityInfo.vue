<script setup lang="ts">
import { ref, watch } from "vue";
import { Activity } from "../../typings/user.ts";
import { useLoading } from "../../utils/utils.ts";
import { useSuccessErrorMessage } from "../../utils/utils.ts";
import { ActivitiesService } from "../../services";
import { useAuthStore, useUserStore } from "../../stores";
import Alert from "../utils/Alert.vue";
import NumberInput from "../utils/NumberInput.vue";

const { loading } = useLoading();
const { success, error } = useSuccessErrorMessage();

const userStore = useUserStore();
const authStore = useAuthStore();

const show = defineModel("show", {
  type: Boolean,
  default: false,
});

const props = defineProps<{
  activity: Activity;
  close: () => void;
  editable: boolean;
}>();

type ActivityForm = {
  activityId: string;
  activityTitle: string;
  activityType: string;
  notes: string;
  hrsCompleted: number;
};

const formData = ref<ActivityForm>({
  activityId: props.activity._id,
  activityTitle: props.activity.activityTitle,
  activityType: props.activity.activityType,
  notes: props.activity.notes,
  hrsCompleted: props.activity.hrsCompleted,
});

const edit = ref<boolean>(false);

const deleteActivity = async () => {
  loading.value = true;
  error.value.message = "";
  error.value.show = false;
  success.value.message = "";
  success.value.show = false;

  const result = await ActivitiesService.delete(
    authStore.authToken,
    props.activity._id,
  );
  if (result.success) {
    success.value.message = "Activity deleted successfully";
    success.value.show = true;
    await userStore.getUser();
    props.close();
  } else {
    error.value.message = result.error ?? "Failed to delete activity";
    error.value.show = true;
  }

  loading.value = false;
};

const updateActivity = async () => {
  loading.value = true;
  error.value.message = "";
  error.value.show = false;
  success.value.message = "";
  success.value.show = false;

  console.log(formData.value);
  const result = await ActivitiesService.update(
    authStore.authToken,
    formData.value,
  );

  if (result.success) {
    success.value.message = "Activity updated successfully";
    success.value.show = true;
    edit.value = false;
    await userStore.getUser();
  } else {
    error.value.message = result.error ?? "Failed to delete activity";
    error.value.show = true;
  }

  loading.value = false;
};

watch(
  () => props,
  () => {
    formData.value = {
      activityId: props.activity._id,
      activityTitle: props.activity.activityTitle,
      activityType: props.activity.activityType,
      notes: props.activity.notes,
      hrsCompleted: props.activity.hrsCompleted,
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
        <span class="headline">Activity Info</span>
        <v-btn icon="mdi-close" variant="text" @click="props.close"></v-btn>
      </v-card-title>
      <v-card-text v-if="props.editable && edit">
        <v-row>
          <v-col cols="12">
            <v-text-field
              :loading="loading"
              v-model="formData.activityTitle"
              label="Activity Title"
              aria-required="true"
              outlined
              variant="solo-filled"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              :loading="loading"
              v-model="formData.activityType"
              label="Activity Type"
              aria-required="true"
              outlined
              variant="solo-filled"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              :loading="loading"
              v-model="formData.notes"
              label="Notes"
              aria-required="true"
              outlined
              variant="solo-filled"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <NumberInput
              label="Hours Completed"
              v-model="formData.hrsCompleted"
              :loading="loading"
              :min="0"
              aria-required="true"
              outlined
              variant="solo-filled"
              required
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text v-else>
        <v-row>
          <v-col cols="12">
            <v-list-item
              title="Activity Title"
              :subtitle="formData.activityTitle"
            ></v-list-item>
          </v-col>
          <v-col cols="12">
            <v-list-item
              title="Activity Type"
              :subtitle="formData.activityType"
            ></v-list-item>
          </v-col>
          <v-col cols="12">
            <v-list-item title="Notes" :subtitle="formData.notes"></v-list-item>
          </v-col>
          <v-col cols="12">
            <v-list-item
              title="Hours Completed"
              :subtitle="formData.hrsCompleted"
            ></v-list-item>
          </v-col>
          <v-col cols="12">
            <v-list-item
              title="Date Created"
              :subtitle="
                new Date(props.activity.createdAt).toLocaleDateString()
              "
            ></v-list-item>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions v-if="props.editable">
        <v-btn @click="edit = !edit" color="primary">
          {{ edit ? "Cancel" : "Edit" }}
        </v-btn>
        <v-btn
          v-if="edit"
          @click="updateActivity"
          :loading="loading"
          color="success"
        >
          Save
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          @click="deleteActivity"
          color="error"
          :loading="loading"
          v-if="props.editable"
        >
          Delete
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
