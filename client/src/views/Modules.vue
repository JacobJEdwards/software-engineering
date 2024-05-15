<script setup lang="ts">
import UserLoading from "../components/UserLoading.vue";
import { useUserStore } from "../stores";
import { computed, ref } from "vue";
import type { Module } from "../typings/user";

const userStore = useUserStore();

const modules = ref<Module[]>(userStore.modules);
const search = ref<string>("");
const expanded = ref<string[]>([]);

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
        <v-card
          title="All modules"
          prepend-icon="mdi-dots-horizontal"
          flat
          elevation="3"
          rounded="md"
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
                <v-btn color="primary" variant="text"></v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped></style>