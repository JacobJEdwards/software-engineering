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
  startDate: Date;
  endDate: Date;
};

const formData = ref<FormData>({
  title: props.milestoneTitle ?? "",
  type: props.milestoneType ?? "",
  startDate: props.startDate ?? new Date(Date.now()),
  endDate: props.endDate ?? new Date(Date.now()),
});

watch(
  () => props,
  () => {
    formData.value = {
      title: props.milestoneTitle ?? "",
      type: props.milestoneType ?? "",
      startDate: props.startDate ?? new Date(Date.now()),
      endDate: props.endDate ?? new Date(Date.now()),
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
            <v-col cols="12">
              <v-text-field
                v-model="formData.startDate"
                label="Start Date"
                required
                variant="solo-filled"
                outlined
                aria-required="true"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="formData.endDate"
                label="End Date"
                required
                variant="solo-filled"
                outlined
                aria-required="true"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="close" color="primary">Close</v-btn>
        <v-btn @click="close" color="primary">Save</v-btn>
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
