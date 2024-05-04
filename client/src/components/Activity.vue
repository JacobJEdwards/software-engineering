<script setup lang="ts">
import { Activity } from "../typings/user.ts";
import { ref } from "vue";
import ActivityInfo from "./modals/ActivityInfo.vue";

const props = defineProps<{
  activity: Activity;
}>();

const showEdit = ref<boolean>(false);
</script>

<template>
  <v-list-item>
    <v-list-item-title>
      {{ props.activity.activityTitle }}
    </v-list-item-title>
    <v-divider></v-divider>
    <v-list-item-subtitle
      class="text-truncate d-flex align-center justify-space-between"
    >
      <span>{{ props.activity.notes }}</span>
      <span>{{ props.activity.activityType }}</span>
      <span class="mr-8">
        {{ new Date(props.activity.createdAt).toLocaleDateString() }}
      </span>
      <v-btn
        @click="showEdit = !showEdit"
        :icon="showEdit ? 'mdi-close' : 'mdi-information-outline'"
        variant="text"
      ></v-btn>
    </v-list-item-subtitle>
    <template #append> </template>
  </v-list-item>
  <ActivityInfo
    :activity="props.activity"
    v-model:show="showEdit"
    :close="() => (showEdit = false)"
    editable
  />
</template>

<style scoped></style>
