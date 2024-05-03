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
    <v-list-item-subtitle>
      {{ props.activity.notes }} {{ props.activity.activityType }}
      {{ new Date(props.activity.createdAt).toLocaleDateString() }}
    </v-list-item-subtitle>
    <template #append>
      <v-list-item-action>
        <v-btn
          @click="showEdit = !showEdit"
          :icon="showEdit ? 'mdi-close' : 'mdi-information-outline'"
          variant="text"
        ></v-btn>
      </v-list-item-action>
    </template>
  </v-list-item>
  <ActivityInfo
    :activity="props.activity"
    v-model:show="showEdit"
    :close="() => (showEdit = false)"
    editable
  />
</template>

<style scoped></style>
