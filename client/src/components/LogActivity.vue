<script setup lang="ts">
import { ref } from "vue";
import CreateActivity from "./modals/CreateActivity.vue";
import { useUserStore } from "../stores";
import type { Task } from "../typings/user.ts";

const userStore = useUserStore();

const tasks = ref<Task[]>(userStore.tasks ?? []);

const dialog = ref<boolean>(false);
const expanded = ref<boolean>(false);

userStore.$subscribe(() => {
  tasks.value = userStore.tasks ?? [];
});

const showModel = () => {
  if (!tasks.value.length) {
    return;
  }

  dialog.value = true;
};
</script>

<template>
  <v-btn
    v-if="!dialog"
    fab
    small
    color="accent"
    dark
    class="position-fixed bottom-6 right-8"
    max-width="10rem"
    @click="showModel"
    rounded="md"
  >
    <v-tooltip v-if="!tasks.length" activator="parent" location="left">
      Please add a task first
    </v-tooltip>
    <span> Log Activity </span>
  </v-btn>

  <CreateActivity v-model:show="dialog" :close="() => (dialog = false)" />
  <!--
    <v-expand-x-transition>
      <span v-if="expanded" class="transition-element">
        <span class="text">Log Activity</span>
      </span>
    </v-expand-x-transition>
    <v-expand-x-transition>
      <span v-if="!expanded" class="transition-element">
        <v-icon>mdi-plus</v-icon>
      </span>
    </v-expand-x-transition>
  </v-btn>
  -->

  <!-- modal -->
</template>

<style scoped>
.transition-element {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
