<script setup lang="ts">
import UserLoading from "../components/UserLoading.vue";
import { useUserStore } from "../stores";
import { computed, ref } from "vue";
import type { Milestone, Task as TaskType } from "../typings/user";
import AddMilestone from "../components/AddMilestone.vue";
import MilestoneInfo from "../components/modals/MilestoneInfo.vue";
import CreateTask from "../components/modals/CreateTask.vue";
import MilestoneTasks from "../components/MilestoneTasks.vue";

const userStore = useUserStore();

const hasSemester = computed(() => !!userStore.user?.semester?.length);

const milestones = ref<Milestone[]>(userStore.milestones);
const search = ref<string>("");
const expanded = ref<string[]>([]);

const showMilestoneInfo = ref<boolean>(false);
const selectedMilestone = ref<Milestone | null>(null);
const showCreateTask = ref<boolean>(false);

const upComingMilestones = computed(() =>
  milestones.value
    .filter((milestone) => new Date(milestone.endDate) > new Date())
    .sort(
      (a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
    )
    .splice(0, 5),
);

const headers = [
  { title: "Title", key: "milestoneTitle", sortable: false },
  { title: "Type", key: "milestoneType" },
  { title: "Start Date", key: "startDate" },
  { title: "End Date", key: "endDate" },
  { title: "LTS Defined", key: "ltsDefined" },
  { title: "", key: "action", sortable: false },
];

const editMilestone = (milestone: Milestone) => {
  selectedMilestone.value = milestone;
  showMilestoneInfo.value = !showMilestoneInfo.value;
};

const showAddTask = (milestone: Milestone) => {
  selectedMilestone.value = milestone;
  showCreateTask.value = true;
};

userStore.$subscribe(() => {
  milestones.value = userStore.milestones;
});
</script>

<template>
  <v-container>
    <UserLoading v-if="userStore.loading" />

    <v-row v-else>
      <v-col cols="12" md="6">
        <v-card elevation="3" rounded="md">
          <v-card-title class="card-title">
            <v-icon>mdi-calendar</v-icon>
            <span>Upcoming Milestones</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-list v-if="upComingMilestones.length > 0">
              <v-list-item
                v-for="milestone in upComingMilestones"
                :key="milestone._id"
              >
                <v-list-item-title class="d-flex justify-space-between">
                  <span>{{ milestone.milestoneTitle }}</span>
                  <p class="caption text-sm text-gray-500">
                    {{ milestone.milestoneType }}
                  </p>
                </v-list-item-title>
                <v-list-item-subtitle>
                  <span class="font-bold">Due: </span
                  >{{ new Date(milestone.endDate).toLocaleDateString() }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
            <p v-else class="text-lg mb-4">No milestones due soon!</p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-row>
          <v-col cols="12">
            <v-card
              title="Add a Milestone"
              prepend-icon="mdi-clipboard-outline"
              elevation="3"
              rounded="md"
            >
              <v-divider></v-divider>
              <v-card-text>
                <AddMilestone :enabled="hasSemester" />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12">
        <v-card
          title="All milestones"
          prepend-icon="mdi-dots-horizontal"
          rounded="md"
          elevation="3"
        >
          <template #text>
            <v-text-field
              v-model="search"
              label="Search"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              hide-details
              single-line
            ></v-text-field>
          </template>
          <v-card-text>
            <v-data-table
              :loading="userStore.loading"
              :items="milestones"
              :headers="headers"
              :search="search"
              item-value="_id"
              show-expand
              v-model:expanded="expanded"
            >
              <template #item.startDate="{ item }">
                {{ new Date(item.startDate).toLocaleDateString() }}
              </template>
              <template #item.endDate="{ item }">
                {{ new Date(item.endDate).toLocaleDateString() }}
              </template>
              <template #item.ltsDefined="{ item }">
                <v-icon :color="item.ltsDefined ? 'success' : 'error'">{{
                  item.ltsDefined ? "mdi-check" : "mdi-close"
                }}</v-icon>
              </template>
              <template #item.action="{ item }">
                <v-btn
                  color="primary"
                  variant="text"
                  :icon="
                    showMilestoneInfo && selectedMilestone === item
                      ? 'mdi-close'
                      : item.ltsDefined
                        ? 'mdi-information-outline'
                        : 'mdi-pencil'
                  "
                  @click="editMilestone(item)"
                ></v-btn>
              </template>
              <template #expanded-row="{ item, columns }">
                <tr>
                  <td :colspan="columns.length">
                    <h3 class="text-lg font-bold my-2">Tasks</h3>
                    <MilestoneTasks :milestone="item" />
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <MilestoneInfo
    v-if="selectedMilestone"
    :milestone="selectedMilestone"
    v-model:show="showMilestoneInfo"
    :editable="!selectedMilestone.ltsDefined"
    :close="() => (showMilestoneInfo = false)"
  />
</template>

<style scoped></style>
