<script setup lang="ts">
import type { Milestone } from "../typings/user";
import { ref } from "vue";
import MilestoneInfo from "./modals/MilestoneInfo.vue";

const props = defineProps<{
  milestone: Milestone;
}>();

const showEdit = ref<boolean>(false);
</script>

<template>
  <v-list-item>
    <v-list-item-title class="d-flex align-center justify-space-between">
      <span>{{ props.milestone.milestoneTitle }}</span>
      <v-chip color="warning" v-if="props.milestone.ltsDefined" class="ml-4"
        >LTS Defined</v-chip
      >
    </v-list-item-title>
    <v-divider></v-divider>
    <v-list-item-subtitle
      class="text-truncate d-flex align-center justify-space-between"
    >
      <v-chip color="secondary" class="ml-4">{{
        props.milestone.milestoneType
      }}</v-chip>
      <span class="mr-8">
        <span class="font-bold">Start Date: </span>
        {{ new Date(props.milestone.startDate).toLocaleDateString() }}
      </span>
      <span class="mr-8">
        <span class="font-bold">End Date: </span>
        {{ new Date(props.milestone.endDate).toLocaleDateString() }}
      </span>
      <v-btn
        @click="showEdit = !showEdit"
        :icon="showEdit ? 'mdi-close' : 'mdi-information-outline'"
        variant="text"
      ></v-btn>
    </v-list-item-subtitle>
  </v-list-item>
  <MilestoneInfo
    :milestone="props.milestone"
    :editable="!milestone.ltsDefined"
    :close="() => (showEdit = false)"
    v-model:show="showEdit"
  />
</template>
