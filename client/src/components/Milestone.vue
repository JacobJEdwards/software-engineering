<script setup lang="ts">
import type { Milestone } from "../typings/user";
import Task from "./Task.vue";

defineProps<{
  milestone: Milestone;
}>();
</script>

<template>
  <v-card>
    <v-card-title>
      {{ milestone.milestoneTitle }}
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col>
          <v-chip>
            {{ milestone.milestoneType }}
          </v-chip>
        </v-col>
        <v-col>
          <v-chip>
            {{ milestone.endDate }}
          </v-chip>
        </v-col>
      </v-row>
      <v-row v-if="milestone.tasks.length > 0">
        <v-col>
          <v-list>
            <v-list-item v-for="task in milestone.tasks" :key="task._id">
              <Task :task="task" />
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
