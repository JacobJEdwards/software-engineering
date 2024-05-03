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
    <div v-if="relevantActivities.length === 0">
      <v-list-item>
        <v-list-item-subtitle>No activities found! </v-list-item-subtitle>
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
    </div>
    <Activity
      v-for="activity in relevantActivities"
      :key="activity._id"
      :activity="activity"
    />
  </v-list>
</template>

<style scoped></style>
