<script setup lang="ts">
import { ref, computed } from "vue";
import { Activity as ActivityType } from "../typings/user";
import { useUserStore } from "../stores";
import Activity from "./Activity.vue";

const props = defineProps<{
  taskId: string;
}>();

const emits = defineEmits(["log-activity"]);

const userStore = useUserStore();

const activities = ref<ActivityType[]>(userStore.activities);

const relevantActivities = computed(() =>
  activities.value.filter((activity) => activity.tasks.includes(props.taskId)),
);

userStore.$subscribe(() => {
  activities.value = userStore.activities;
});
</script>

<template>
  <v-list>
    <v-list-item>
      <v-list-item-subtitle>
        {{ relevantActivities.length }}
        {{ relevantActivities.length === 1 ? "activity" : "activities" }}
      </v-list-item-subtitle>
      <v-divider inset color="error"></v-divider>
      <template #append>
        <v-list-item-action>
          <v-btn
            @click="emits('log-activity')"
            icon="mdi-plus"
            variant="text"
            text="Log Activity"
          ></v-btn>
        </v-list-item-action>
      </template>
    </v-list-item>
    <Activity
      v-for="activity in relevantActivities"
      :key="activity._id"
      :activity="activity"
    />
    <v-divider inset></v-divider>
  </v-list>
</template>

<style scoped></style>
