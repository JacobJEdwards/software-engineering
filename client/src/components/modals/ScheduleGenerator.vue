<script setup lang="ts">
import { ref, watch } from "vue";
import { MilestoneTypes } from "../../typings/user.ts";
import Alert from "../utils/Alert.vue";
import { useSuccessErrorMessage } from "../../utils/utils.ts";
import { UserService } from "../../services";
import { useAuthStore } from "../../stores";

const { error, success } = useSuccessErrorMessage();
const authStore = useAuthStore();

const show = defineModel("show", {
  type: Boolean,
  default: false,
});

const addSemesterOpen = ref([]);
const addModuleOpen = ref([]);
const addMilestoneOpen = ref([]);

const props = defineProps<{
  close: () => void;
}>();

const semesterFormData = ref<{
  SemesterName: string;
  SemesterStartDate?: Date;
  SemesterEndDate?: Date;
}>({
  SemesterName: "",
});

const moduleFormData = ref<{
  ModuleCode: string;
  ModuleName: string;
  ModuleStartDate?: Date;
  ModuleEndDate?: Date;
}>({
  ModuleCode: "",
  ModuleName: "",
});

const milestoneFormData = ref<{
  MilestoneTitle: string;
  MilestoneType: string;
  MilestoneStartDate?: Date;
  MilestoneEndDate?: Date;
}>({
  MilestoneTitle: "",
  MilestoneType: MilestoneTypes.ASSIGNMENT,
});

const semesters = ref<
  {
    SemesterName: string;
    SemesterStartDate: Date;
    SemesterEndDate: Date;
    modules: {
      ModuleCode: string;
      ModuleName: string;
      ModuleStartDate: Date;
      ModuleEndDate: Date;
      milestones: {
        MilestoneTitle: string;
        MilestoneType: string;
        MilestoneStartDate: Date;
        MilestoneEndDate: Date;
      }[];
    }[];
  }[]
>([]);

const saveSemester = () => {
  semesters.value.push({
    SemesterName: semesterFormData.value.SemesterName,
    SemesterStartDate: semesterFormData.value.SemesterStartDate ?? new Date(),
    SemesterEndDate: semesterFormData.value.SemesterEndDate ?? new Date(),
    modules: [],
  });
  semesterFormData.value = {
    SemesterName: "",
    SemesterEndDate: undefined,
    SemesterStartDate: undefined,
  };

  addSemesterOpen.value = [];
};

const saveModule = (semester: any) => {
  semester.modules.push({
    ModuleCode: moduleFormData.value.ModuleCode,
    ModuleName: moduleFormData.value.ModuleName,
    ModuleStartDate: moduleFormData.value.ModuleStartDate ?? new Date(),
    ModuleEndDate: moduleFormData.value.ModuleEndDate ?? new Date(),
    milestones: [],
  });

  semesters.value = semesters.value.map((s) => {
    if (s.SemesterName === semester.SemesterName) {
      return semester;
    }
    return s;
  });

  moduleFormData.value = {
    ModuleCode: "",
    ModuleName: "",
    ModuleStartDate: undefined,
    ModuleEndDate: undefined,
  };

  addModuleOpen.value = [];
};

const saveMilestone = (semester: any, module: any) => {
  module.milestones.push({
    MilestoneTitle: milestoneFormData.value.MilestoneTitle,
    MilestoneType: milestoneFormData.value.MilestoneType,
    MilestoneStartDate:
      milestoneFormData.value.MilestoneStartDate ?? new Date(),
    MilestoneEndDate: milestoneFormData.value.MilestoneEndDate ?? new Date(),
  });

  semester.modules = semester.modules.map((m) => {
    if (m.ModuleCode === module.ModuleCode) {
      return module;
    }
    return m;
  });

  semesters.value = semesters.value.map((s) => {
    if (s.SemesterName === semester.SemesterName) {
      return semester;
    }
    return s;
  });

  milestoneFormData.value = {
    MilestoneTitle: "",
    MilestoneType: "",
    MilestoneStartDate: undefined,
    MilestoneEndDate: undefined,
  };

  addMilestoneOpen.value = [];
};

const saveData = async () => {
  const data: {
    SemesterName: string;
    SemesterStartDate: Date;
    SemesterEndDate: Date;
    ModuleCode: string;
    ModuleName: string;
    ModuleStartDate: Date;
    ModuleEndDate: Date;
    MilestoneTitle: string;
    MilestoneType: string;
    MilestoneStartDate: Date;
    MilestoneEndDate: Date;
  }[] = [];

  for (const semester of semesters.value) {
    for (const module of semester.modules) {
      for (const milestone of module.milestones) {
        data.push({
          SemesterName: semester.SemesterName,
          SemesterStartDate: semester.SemesterStartDate,
          SemesterEndDate: semester.SemesterEndDate,
          ModuleCode: module.ModuleCode,
          ModuleName: module.ModuleName,
          ModuleStartDate: module.ModuleStartDate,
          ModuleEndDate: module.ModuleEndDate,
          MilestoneTitle: milestone.MilestoneTitle,
          MilestoneType: milestone.MilestoneType,
          MilestoneStartDate: milestone.MilestoneStartDate,
          MilestoneEndDate: milestone.MilestoneEndDate,
        });
      }
    }
  }

  const headers = [
    "SemesterName",
    "SemesterStartDate",
    "SemesterEndDate",
    "ModuleCode",
    "ModuleName",
    "ModuleStartDate",
    "ModuleEndDate",
    "MilestoneTitle",
    "MilestoneType",
    "MilestoneStartDate",
    "MilestoneEndDate",
  ];

  let csv = headers.join(",") + "\n";
  csv += data
    .map((row) => headers.map((header) => row[header]).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "schedule.csv";
  a.click();

  success.value.show = true;
  success.value.message = "Data exported successfully";
  props.close();
};
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
        <v-card flat title="Semesters">
          <v-card-text>
            <v-expansion-panels>
              <v-expansion-panel v-for="semester of semesters">
                <v-expansion-panel-title>
                  {{ semester.SemesterName }}
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <p class="caption">Modules</p>
                  <v-expansion-panels v-model="addModuleOpen">
                    <v-expansion-panel
                      v-for="module of semester.modules"
                      :title="module.ModuleCode + ' - ' + module.ModuleName"
                    >
                      <v-expansion-panel-text>
                        <p class="caption">Milestones</p>
                        <v-expansion-panels>
                          <v-expansion-panel
                            v-for="milestone of module.milestones"
                          >
                            <v-expansion-panel-title>
                              {{ milestone.MilestoneTitle }}
                            </v-expansion-panel-title>
                            <v-expansion-panel-text>
                              {{ milestone.MilestoneType }}
                              {{ milestone.MilestoneStartDate }}
                              {{ milestone.MilestoneEndDate }}
                            </v-expansion-panel-text>
                          </v-expansion-panel>
                        </v-expansion-panels>
                        <v-expansion-panels
                          v-model="addMilestoneOpen"
                          flat
                          class="mt-4"
                        >
                          <v-expansion-panel title="Add Milestone">
                            <v-expansion-panel-text>
                              <v-text-field
                                v-model="milestoneFormData.MilestoneTitle"
                                label="Milestone Title"
                                outlined
                                variant="solo-filled"
                                dense
                              ></v-text-field>
                              <v-select
                                v-model="milestoneFormData.MilestoneType"
                                label="Milestone Type"
                                outlined
                                variant="solo-filled"
                                dense
                                :items="
                                  Object.values(MilestoneTypes) as string[]
                                "
                              ></v-select>
                              <v-row class="d-flex justify-center align-center">
                                <v-col cols="6">
                                  <v-date-picker
                                    v-model="
                                      milestoneFormData.MilestoneStartDate
                                    "
                                    label="Start Date"
                                    outlined
                                    dense
                                  ></v-date-picker>
                                </v-col>
                                <v-col cols="6">
                                  <v-date-picker
                                    v-model="milestoneFormData.MilestoneEndDate"
                                    label="End Date"
                                    outlined
                                    dense
                                  ></v-date-picker>
                                </v-col>
                              </v-row>
                              <v-btn
                                color="success"
                                @click="() => saveMilestone(semester, module)"
                                block
                                rounded="md"
                                >Save</v-btn
                              >
                            </v-expansion-panel-text>
                          </v-expansion-panel>
                        </v-expansion-panels>
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>
                  <v-expansion-panels v-model="addModuleOpen" flat>
                    <v-expansion-panel title="Add Module">
                      <v-expansion-panel-text>
                        <v-text-field
                          v-model="moduleFormData.ModuleCode"
                          label="Module Code"
                          outlined
                          variant="solo-filled"
                          dense
                        ></v-text-field>
                        <v-text-field
                          v-model="moduleFormData.ModuleName"
                          label="Module Name"
                          outlined
                          variant="solo-filled"
                          dense
                        ></v-text-field>
                        <v-row class="d-flex justify-center align-center">
                          <v-col cols="6">
                            <v-date-picker
                              v-model="moduleFormData.ModuleStartDate"
                              label="Start Date"
                              outlined
                              dense
                            ></v-date-picker>
                          </v-col>
                          <v-col cols="6">
                            <v-date-picker
                              v-model="moduleFormData.ModuleEndDate"
                              label="End Date"
                              outlined
                              dense
                            ></v-date-picker>
                          </v-col>
                        </v-row>
                        <v-btn
                          color="success"
                          @click="() => saveModule(semester)"
                          block
                          rounded="md"
                          >Save</v-btn
                        >
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
            <v-expansion-panels class="my-6" flat>
              <v-expansion-panel v-model="addSemesterOpen">
                <template #title> Add Semester </template>

                <template #text>
                  <v-text-field
                    v-model="semesterFormData.SemesterName"
                    label="Semester Name"
                    outlined
                    variant="solo-filled"
                    dense
                  ></v-text-field>
                  <v-row class="d-flex justify-center align-center">
                    <v-col cols="6">
                      <v-date-picker
                        v-model="semesterFormData.SemesterStartDate"
                        label="Start Date"
                        outlined
                        dense
                      ></v-date-picker>
                    </v-col>
                    <v-col cols="6">
                      <v-date-picker
                        v-model="semesterFormData.SemesterEndDate"
                        label="End Date"
                        outlined
                        dense
                      ></v-date-picker>
                    </v-col>
                  </v-row>
                  <v-btn
                    color="success"
                    @click="saveSemester"
                    block
                    rounded="md"
                    >Save</v-btn
                  >
                </template>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card-text>
        </v-card>
        <v-divider class="my-2"></v-divider>
        <v-btn color="success" @click="saveData" block rounded="md"
          >Export All to CSV</v-btn
        >
      </v-card-text>
    </v-card>
  </v-dialog>
  <Alert
    type="success"
    :message="error.message"
    v-model:show="error.show"
    :close="() => (error.show = false)"
  />
  <Alert
    type="error"
    :message="success.message"
    v-model:show="success.show"
    :close="() => (success.show = false)"
  />
</template>
