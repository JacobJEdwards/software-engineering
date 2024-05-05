<script setup lang="ts">
import { ref } from "vue";
import { MilestoneTypes } from "../typings/user.ts";

type FormData = {
  moduleCode: string;
  moduleName: string;
  milestoneTitle: string;
  milestoneType: string;
  deadline: string | null;
};

const formData = ref<FormData>({
  moduleCode: "",
  moduleName: "",
  milestoneTitle: "",
  milestoneType: "",
  deadline: null,
});

const entries = ref<Array<FormData>>([]);

const saveEntry = () => {
  const newEntry = { ...formData.value };
  entries.value.push(newEntry);

  formData.value = {
    moduleCode: "",
    moduleName: "",
    milestoneTitle: "",
    milestoneType: "",
    deadline: null,
  };
};

const deleteEntry = (index: number) => {
  entries.value.splice(index, 1);
};

const exportCSV = () => {
  let csvContent =
    "ModuleCode,ModuleName,MilestoneTitle,MilestoneType,Deadline\n";

  entries.value.forEach((entry) => {
    csvContent += `${entry.moduleCode},${entry.moduleName},${entry.milestoneTitle},${entry.milestoneType},${entry.deadline}\n`;
  });

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
</script>

<template>
  <v-container>
    <v-form ref="form">
      <v-text-field
        v-model="formData.moduleCode"
        label="Module Code"
        outlined
        required
        variant="solo-filled"
        aria-required="true"
      ></v-text-field>
      <v-text-field
        v-model="formData.moduleName"
        label="Module Name"
        outlined
        required
        variant="solo-filled"
        aria-required="true"
      ></v-text-field>
      <v-text-field
        v-model="formData.milestoneTitle"
        label="Milestone Title"
        outlined
        required
        variant="solo-filled"
        aria-required="true"
      ></v-text-field>
      <v-select
        v-model="formData.milestoneType"
        :items="Object.values(MilestoneTypes) as string[]"
        label="Milestone Type"
        outlined
        required
        variant="solo-filled"
        aria-required="true"
      ></v-select>
      <v-date-picker
        v-model="formData.deadline"
        label="Deadline"
        scrollable
      ></v-date-picker>
      <v-btn
        color="black"
        @click="saveEntry"
        :disabled="
          !formData.moduleCode ||
          !formData.moduleName ||
          !formData.milestoneTitle ||
          !formData.milestoneType ||
          !formData.deadline
        "
        >Save Entry</v-btn
      >
    </v-form>

    <v-container v-if="entries.length > 0">
      <v-divider></v-divider>
      <v-row align="center">
        <v-col>
          <p>{{ entries.length }} entries saved</p>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row>
        <v-col v-for="(entry, index) in entries" :key="index" cols="12">
          <v-card>
            <v-card-title>{{ entry.moduleName }}</v-card-title>
            <v-card-text>
              <b>Module Code:</b> {{ entry.moduleCode }}<br />
              <b>Milestone Title:</b> {{ entry.milestoneTitle }}<br />
              <b>Milestone Type:</b> {{ entry.milestoneType }}<br />
              <b>Deadline:</b> {{ entry.deadline }}<br /><br />

              <v-btn color="error" @click="deleteEntry(index)">Delete</v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-divider class="my-2"></v-divider>
    <v-btn color="success" @click="exportCSV">Export All to CSV</v-btn>
  </v-container>
</template>
