<script setup lang="ts">
import { ref } from "vue";
import CreateMilestone from "./modals/CreateMilestone.vue";
const modelVisible = ref<boolean>(false);

const props = defineProps({
  enabled: {
    type: Boolean,
    default: true,
  },
});

const showModel = () => {
  if (!props.enabled) {
    return;
  }

  modelVisible.value = true;
};
</script>

<template>
  <v-container>
    <v-btn @click="showModel" color="secondary" rounded="md" block>
      <v-tooltip v-if="!props.enabled" activator="parent" location="top">
        Please upload a schedule first
      </v-tooltip>
      <span>Add Milestone</span>
    </v-btn>
    <CreateMilestone
      v-model:show="modelVisible"
      :close="() => (modelVisible = false)"
    />
  </v-container>
</template>
