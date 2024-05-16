<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Activity as ActivityType } from "../typings/user";
import { useUserStore } from "../stores";
import Task from "./Task.vue";
import { Milestone as MilestoneType } from "../typings/user";
import { Task as TaskType } from "../typings/user";
import Milestone from "./Milestone.vue";

const props = defineProps<{
  milestones: MilestoneType[];
}>();

const milestones = ref<MilestoneType[]>(props.milestones);

const emits = defineEmits(["add-milestone"]);

const userStore = useUserStore();

userStore.$subscribe(() => {
  milestones.value = userStore.milestones;
});

watch(
  () => props.milestones,
  (newMilestones) => {
    milestones.value = newMilestones;
  },
);
</script>

<template>
  <v-list>
    <v-list-item>
      <v-list-item-subtitle>
        {{ milestones.length }}
        {{ milestones.length === 1 ? "milestone" : "milestones" }}
      </v-list-item-subtitle>
      <v-divider inset color="error"></v-divider>
      <template #append>
        <v-list-item-action>
          <v-btn
            @click="emits('add-milestone')"
            icon="mdi-plus"
            variant="text"
            text="Add Milestone"
          ></v-btn>
        </v-list-item-action>
      </template>
    </v-list-item>
    <Milestone
      v-for="milestone in milestones"
      :key="milestone._id"
      :milestone="milestone"
    />
    <v-divider inset></v-divider>
  </v-list>
</template>

<style scoped></style>
