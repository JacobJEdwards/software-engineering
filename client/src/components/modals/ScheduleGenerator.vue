<script setup lang="ts">
import { ref, watch } from "vue";
import { MilestoneTypes } from "../../typings/user.ts";

const show = defineModel("show", {
  type: Boolean,
  default: false,
});

const props = defineProps<{
  close: () => void;
  semesterNames?: Array<string>;
}>();

// based on headers
type FormData = {
  SemesterName: string;
  SemesterStartDate?: Date;
  SemesterEndDate?: Date;
  ModuleCode: string;
  ModuleName: string;
  ModuleStartDate?: Date;
  ModuleEndDate?: Date;
  MilestoneTitle: string;
  MilestoneType: string;
  MilestoneStartDate?: Date;
  MilestoneEndDate?: Date;
};

const formData = ref<FormData>({
  SemesterName: "",
  ModuleCode: "",
  ModuleName: "",
  MilestoneTitle: "",
  MilestoneType: "",
});

const semesters = ref<Array<string>>(props.semesterNames ?? []);
const entries = ref<Array<FormData>>([]);

const saveEntry = () => {
  const newEntry = { ...formData.value };
  entries.value.push(newEntry);

  formData.value = {
    SemesterName: "",
    ModuleCode: "",
    ModuleName: "",
    MilestoneTitle: "",
    MilestoneType: "",
  };
};

const deleteEntry = (index: number) => {
  entries.value.splice(index, 1);
};

const exportCSV = () => {
  const headers =
    "SemesterName,SemesterStartDate,SemesterEndDate,ModuleCode,ModuleName,ModuleStartDate,ModuleEndDate,MilestoneTitle,MilestoneType,MilestoneStartDate,MilestoneEndDate";

  const csvContent = entries.value.reduce((acc, entry) => {
    return (
      acc +
      `${entry.SemesterName},${entry.SemesterStartDate},${entry.SemesterEndDate},${entry.ModuleCode},${entry.ModuleName},${entry.ModuleStartDate},${entry.ModuleEndDate},${entry.MilestoneTitle},${entry.MilestoneType},${entry.MilestoneStartDate},${entry.MilestoneEndDate}\n`
    );
  }, headers + "\n");

  semesters.value.push(formData.value.SemesterName);

  const blob = new Blob([csvContent], { type: "text/csv" });
  const encodedUri = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "schedule.csv");
  document.body.appendChild(link);
  link.click();
  link.remove();

  entries.value = [];
};

watch(
  () => props.semesterNames,
  (newVal) => {
    semesters.value = newVal
      ? [...newVal, ...semesters.value]
      : semesters.value;
  },
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
    <v-card elevation="3" rounded="md">
      <v-card-title class="d-flex justify-space-between">
        <span class="headline">Schedule Generator</span>
        <v-btn icon="mdi-close" variant="text" @click="props.close"></v-btn>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <p>{{ entries.length }} entries saved</p>
            </v-col>
            <v-divider></v-divider>
          </v-row>
          <v-divider class="my-4"></v-divider>
          <v-select
            v-model="formData.SemesterName"
            :items="semesters"
            label="Semester Name"
            outlined
            required
            variant="solo-filled"
          ></v-select>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.ModuleCode"
                label="Module Code"
                outlined
                required
                variant="solo-filled"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.ModuleName"
                label="Module Name"
                outlined
                required
                variant="solo-filled"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="formData.MilestoneTitle"
                label="Milestone Title"
                outlined
                required
                variant="solo-filled"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="formData.MilestoneType"
                :items="Object.values(MilestoneTypes) as Array<string>"
                label="Milestone Type"
                outlined
                required
                variant="solo-filled"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-date-picker
                v-model="formData.MilestoneStartDate"
                label="Milestone Start Date"
                outlined
                required
                variant="solo-filled"
              ></v-date-picker>
            </v-col>
            <v-col cols="12" md="6">
              <v-date-picker
                v-model="formData.MilestoneEndDate"
                label="Milestone End Date"
                outlined
                required
                variant="solo-filled"
              ></v-date-picker>
            </v-col>
          </v-row>
          <v-btn
            color="primary"
            @click="saveEntry"
            block
            rounded="md"
            :disabled="
              !formData.SemesterName ||
              !formData.ModuleCode ||
              !formData.ModuleName ||
              !formData.MilestoneTitle ||
              !formData.MilestoneType ||
              !formData.MilestoneStartDate ||
              !formData.MilestoneEndDate
            "
            >Save Entry</v-btn
          >
          <v-divider class="my-2"></v-divider>
          <v-container v-if="entries.length > 0">
            <v-row>
              <v-col v-for="(entry, index) in entries" :key="index" cols="12">
                <v-card elevation="3" rounded="md">
                  <v-card-actions>
                    <v-btn
                      color="error"
                      @click="deleteEntry(index)"
                      icon="mdi-delete"
                      variant="text"
                    ></v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-container>

          <v-divider class="my-2"></v-divider>
          <v-btn color="success" @click="exportCSV" block rounded="md"
            >Export All to CSV</v-btn
          >
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
