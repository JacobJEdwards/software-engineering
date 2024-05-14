<script setup lang="ts">
import CreateMilestone from "./CreateMilestone.vue";
import { ref, watch } from "vue";
import { Milestone, MilestoneTypes } from "../../typings/user";
import { useLoading, useSuccessErrorMessage } from "../../utils/utils.ts";
import Alert from "../utils/Alert.vue";
import NumberInput from "../utils/NumberInput.vue";

const { loading } = useLoading();
const { success, error } = useSuccessErrorMessage();

const show = defineModel("show", {
  type: Boolean,
  default: false,
});

const props = defineProps<{
  close: () => void;
  milestone: Milestone;
  editable: boolean;
}>();

type FormData = {
  milestoneTitle: string;
  milestoneType: string;
  milestoneProgress: number;
  startDate: Date;
  endDate: Date;
};

const formData = ref<FormData>({
  milestoneTitle: props.milestone.milestoneTitle,
  milestoneType: props.milestone.milestoneType,
  milestoneProgress: props.milestone.milestoneProgress,
  startDate: new Date(props.milestone.startDate),
  endDate: new Date(props.milestone.endDate),
});

const milestoneSelectTypes = Object.values(MilestoneTypes);

const edit = ref<boolean>(false);

watch(
  () => props,
  () => {
    formData.value = {
      milestoneTitle: props.milestone.milestoneTitle,
      milestoneType: props.milestone.milestoneType,
      milestoneProgress: props.milestone.milestoneProgress,
      startDate: new Date(props.milestone.startDate),
      endDate: new Date(props.milestone.endDate),
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
        <span class="headline">Milestone Info</span>
        <v-btn icon="mdi-close" variant="text" @click="props.close"></v-btn>
      </v-card-title>
      <v-card-text v-if="props.editable && edit">
        <v-row>
          <v-col cols="12">
            <v-text-field
              :loading="loading"
              v-model="formData.milestoneTitle"
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
              v-model="formData.milestoneType"
              label="Status"
              :items="milestoneSelectTypes as string[]"
              aria-required="true"
              variant="solo-filled"
            ></v-select>
          </v-col>
          <v-col cols="12">
            <NumberInput
              persistent-hint
              hint="Please log an activity to update hours."
              :loading="loading"
              v-model="formData.milestoneProgress"
              label="Hours Completed"
              disabled
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-text v-else>
        <v-row>
          <v-col cols="12">
            <v-list-item
              title="Milestone Title"
              :subtitle="formData.milestoneTitle"
            ></v-list-item>
          </v-col>
          <v-col cols="12">
            <v-list-item
              title="Milestone Type"
              :subtitle="formData.milestoneType"
            ></v-list-item>
          </v-col>
          <v-col cols="12">
            <v-list-item
              title="Milestone Progress"
              :subtitle="formData.milestoneProgress"
            ></v-list-item>
          </v-col>
          <v-col cols="12">
            <v-list-item
              title="Start Date"
              :subtitle="new Date(formData.startDate).toLocaleDateString()"
            ></v-list-item>
          </v-col>
          <v-col cols="12">
            <v-list-item
              title="End Date"
              :subtitle="new Date(formData.endDate).toLocaleDateString()"
            ></v-list-item>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-card-actions v-if="props.editable && !props.milestone.ltsDefined">
          <v-btn @click="edit = !edit" color="primary">
            {{ edit ? "Cancel" : "Edit" }}
          </v-btn>
          <v-btn v-if="props.editable" color="error" :loading="loading">
            Delete
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn v-if="edit" color="success" :loading="loading"> Save </v-btn>
        </v-card-actions>
      </v-card-actions>
    </v-card>
    <Alert
      :message="error.message"
      :type="'error'"
      v-model="error.show"
      :close="() => (error.show = false)"
    />
    <Alert
      :message="success.message"
      :type="'success'"
      v-model="success.show"
      :close="() => (success.show = false)"
    />
  </v-dialog>
</template>

<style scoped></style>
