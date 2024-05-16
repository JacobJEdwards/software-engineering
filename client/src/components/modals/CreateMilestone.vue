<script setup lang="ts">
import { useAuthStore, useUserStore } from "../../stores";
import { ref, watch } from "vue";
import { useLoading, useSuccessErrorMessage } from "../..//utils/utils.ts";
import {
  Milestone,
  MilestoneTypes,
  MilestoneType,
} from "../../typings/user.ts";
import Alert from "../utils/Alert.vue";
import NumberInput from "../utils/NumberInput.vue";
import { MilestoneService } from "../../services/milestones.ts";

const authStore = useAuthStore();
const userStore = useUserStore();

const { loading } = useLoading();
const { success, error } = useSuccessErrorMessage();

const show = defineModel("show", {
  type: Boolean,
  default: false,
});

const props = defineProps<
  {
    close: () => void;
  } & Partial<Milestone>
>();

const emit = defineEmits(["created"]);

const milestoneSelectTypes = Object.values(MilestoneTypes);

type FormData = {
  title: string;
  type: string;
  startDate?: Date;
  endDate?: Date;
};

const formData = ref<FormData>({
  title: props.milestoneTitle ?? "",
  type: props.milestoneType ?? "",
  startDate: props.startDate ?? undefined,
  endDate: props.endDate ?? undefined,
});

const createMilestone = async () => {
  loading.value = true;
  error.value.show = false;
  success.value.show = false;

  const result = await MilestoneService.create(
    {
      milestoneTitle: formData.value.title,
      milestoneType: formData.value.type as MilestoneType,
      startDate: formData.value.startDate ?? new Date(),
      endDate: formData.value.endDate ?? new Date(),
    },
    authStore.authToken,
  );

  if (result.success) {
    success.value.message = "Milestone created successfully";
    success.value.show = true;
    emit("created");
    loading.value = false;
  } else {
    error.value.message = result.error ?? "An error occurred";
    error.value.show = true;
    loading.value = false;
  }
};

const closeForm = () => {
  formData.value = {
    title: "",
    type: "",
    startDate: undefined,
    endDate: undefined,
  };
  props.close();
};

watch(
  () => props,
  () => {
    formData.value = {
      title: props.milestoneTitle ?? "",
      type: props.milestoneType ?? "",
      startDate: props.startDate ?? undefined,
      endDate: props.endDate ?? undefined,
    };
  },
  { deep: true },
);
</script>

<template>
  <v-dialog
    v-model="show"
    max-width="800"
    scrollable
    @click:outside="props.close"
  >
    <v-card>
      <v-card-title class="headline"> Create Milestone </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="formData.title"
                label="Title"
                required
                variant="solo-filled"
                outlined
                aria-required="true"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="formData.type"
                :items="milestoneSelectTypes as string[]"
                label="Type"
                required
                variant="solo-filled"
                outlined
                aria-required="true"
              ></v-select>
            </v-col>
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
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn
          @click="closeForm"
          rounded="sm"
          color="primary"
          text="Cancel"
        ></v-btn>
        <v-spacer></v-spacer>
        <v-btn
          @click="createMilestone"
          rounded="sm"
          color="success"
          text="Create"
          :loading="loading"
          :disabled="
            !formData.title ||
            !formData.type ||
            !formData.startDate ||
            !formData.endDate
          "
        ></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <Alert
    type="error"
    :message="error.message"
    :close="() => (error.show = false)"
    v-model:show="error.show"
  />
  <Alert
    type="success"
    :message="success.message"
    :close="() => (success.show = false)"
    v-model:show="success.show"
  />
</template>

<style scoped></style>
