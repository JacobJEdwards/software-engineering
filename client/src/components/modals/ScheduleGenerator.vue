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
              <v-card-text>
                <v-row>
                  <v-item-group>
                    <v-expansion-panel v-for="semester of semesters">
                      <v-expansion-panel-title>
                        {{ semester.SemesterName }}
                      </v-expansion-panel-title>
                      <v-expansion-panel-text>
                        <p class="caption">Modules</p>
                        <v-expansion-panel v-for="module of semester.modules">
                          <v-expansion-panel-title>
                            {{ module.ModuleCode }} - {{ module.ModuleName }}
                          </v-expansion-panel-title>
                          <v-expansion-panel-text>
                            <p class="caption">Milestones</p>
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
                          </v-expansion-panel-text>
                        </v-expansion-panel>
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-item-group>
                  <v-expansion-panel> // add semester </v-expansion-panel>
                </v-row>
              </v-card-text>
            </v-card>
          </v-row>
          <v-divider class="my-2"></v-divider>
          <v-btn color="success" @click="" block rounded="md"
            >Export All to CSV</v-btn
          >
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
