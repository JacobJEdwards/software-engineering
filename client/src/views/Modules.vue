<script setup lang="ts">
import UserLoading from "../components/UserLoading.vue";
import { useUserStore } from "../stores";
import { computed, ref } from "vue";
import type { Module } from "../typings/user";
import ModuleMilestones from "../components/ModuleMilestones.vue";
import ModuleInfo from "../components/modals/ModuleInfo.vue";

const userStore = useUserStore();

const modules = ref<Module[]>(userStore.modules);
const search = ref<string>("");
const expanded = ref<string[]>([]);
const showModuleInfo = ref<boolean>(false);
const selectedModule = ref<Module | null>(null);

const viewModule = (module: Module) => {
  selectedModule.value = module;
  showModuleInfo.value = !showModuleInfo.value;
};

const headers = [
  { title: "Title", key: "moduleName", sortable: false },
  { title: "Code", key: "moduleCode" },
  { title: "Start Date", key: "startDate" },
  { title: "End Date", key: "endDate" },
  { title: "", key: "action", sortable: false },
];

userStore.$subscribe(() => {
  modules.value = userStore.modules;
});
</script>

<template>
  <v-container>
    <UserLoading v-if="userStore.loading" />

    <v-row v-else>
      <v-col cols="12" md="6">
        <v-card> </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-row>
          <v-col cols="12">
            <v-card> </v-card>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="12">
        <v-card flat elevation="3" rounded="md">
          <template #title>
            <v-card-title class="card-title">
              <v-icon color="modules">mdi-dots-horizontal</v-icon>
              <span> All modules</span>
            </v-card-title>
          </template>
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
              :items="modules"
              :headers="headers"
              :search="search"
              item-value="_id"
              show-expand
              v-model:expanded="expanded"
              color="white"
            >
              <template #item.startDate="{ item }">
                {{ new Date(item.startDate).toLocaleDateString() }}
              </template>
              <template #item.endDate="{ item }">
                {{ new Date(item.endDate).toLocaleDateString() }}
              </template>
              <template #item.action="{ item }">
                <v-btn
                  color="primary"
                  variant="text"
                  :icon="
                    showModuleInfo && selectedModule === item
                      ? 'mdi-close'
                      : 'mdi-information-outline'
                  "
                  @click="viewModule(item)"
                ></v-btn>
              </template>
              <template #expanded-row="{ item, columns }">
                <tr>
                  <td :colspan="columns.length">
                    <h3 class="text-lg font-bold my-2">Milestones</h3>
                    <ModuleMilestones :milestones="item.milestones" />
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <ModuleInfo
    :editable="false"
    v-if="selectedModule"
    :module="selectedModule"
    v-model:show="showModuleInfo"
    :close="() => (showModuleInfo = false)"
  />
</template>

<style scoped></style>
