<script setup lang="ts">
import { ref, watch } from "vue";
import { Module } from "../../typings/user";
import { useLoading, useSuccessErrorMessage } from "../../utils/utils.ts";
import Alert from "../utils/Alert.vue";

const { loading } = useLoading();
const { success, error } = useSuccessErrorMessage();

const show = defineModel("show", {
  type: Boolean,
  default: false,
});

const props = defineProps<{
  close: () => void;
  module: Module;
  editable: boolean;
}>();

type FormData = {
  moduleName: string;
  moduleCode: string;
  startDate: Date;
  endDate: Date;
};

const formData = ref<FormData>({
  moduleName: props.module.moduleName,
  moduleCode: props.module.moduleCode,
  startDate: new Date(props.module.startDate),
  endDate: new Date(props.module.endDate),
});

const edit = ref<boolean>(false);

watch(
  () => props,
  () => {
    formData.value = {
      moduleName: props.module.moduleName,
      moduleCode: props.module.moduleCode,
      startDate: new Date(props.module.startDate),
      endDate: new Date(props.module.endDate),
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
        <span class="headline">Module Info</span>
        <v-btn icon="mdi-close" variant="text" @click="props.close"></v-btn>
      </v-card-title>
      <v-card-text v-if="props.editable && edit">
        <v-row>
          <v-col cols="12">
            <v-text-field
              :loading="loading"
              v-model="formData.moduleName"
              label="Name"
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
            <v-text-field
              :loading="loading"
              v-model="formData.moduleCode"
              label="Code"
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
              title="Module Name"
              :subtitle="formData.moduleName"
            ></v-list-item>
          </v-col>
          <v-col cols="12">
            <v-list-item
              title="Module Code"
              :subtitle="formData.moduleCode"
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
        <v-card-actions v-if="props.editable">
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
      type="error"
      v-model="error.show"
      :close="() => (error.show = false)"
    />
    <Alert
      :message="success.message"
      type="success"
      v-model="success.show"
      :close="() => (success.show = false)"
    />
  </v-dialog>
</template>

<style scoped></style>
