<script setup lang="ts">
import { ref, watch } from "vue";
import { MilestoneTypes } from "../../typings/user.ts";

const show = defineModel("show", {
  type: Boolean,
  default: false,
});

const props = defineProps<{
  close: () => void;
}>();

const semesters = ref<
  {
    SemesterName: string;
    SemesterStartDate: Date;
    SemesterEndDate: Date;
  }[]
>([]);

const modules = ref<
  {
    SemesterName: string;
    ModuleCode: string;
    ModuleName: string;
    ModuleStartDate: Date;
    ModuleEndDate: Date;
  }[]
>([]);

const milestones = ref<
  {
    SemesterName: string;
    ModuleCode: string;
    MilestoneTitle: string;
    MilestoneType: string;
    MilestoneStartDate: Date;
    MilestoneEndDate: Date;
  }[]
>([]);

const saveEntry = () => {};
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
    <v-card elevation="3" rounded="md">
      <v-card-title class="d-flex justify-space-between">
        <span class="headline">Schedule Generator</span>
        <v-btn icon="mdi-close" variant="text" @click="props.close"></v-btn>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-card flat title="Semesters">

            </v-card>
          </v-row>
        </v-container>

          <v-divider class="my-2"></v-divider>
          <v-btn color="success" @click="" block rounded="md"
            >Export All to CSV</v-btn
          >
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
