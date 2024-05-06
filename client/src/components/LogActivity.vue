<script setup lang="ts">
import { ref } from "vue";
import CreateActivity from "./modals/CreateActivity.vue";

const dialog = ref<boolean>(false);
const expanded = ref<boolean>(false);
</script>

<template>
  <v-btn
    v-if="!dialog"
    @mouseenter="expanded = true"
    @mouseleave="expanded = false"
    :prepend-icon="!expanded ? '' : 'mdi-plus'"
    fab
    small
    color="accent"
    dark
    class="position-fixed bottom-14 right-8"
    max-width="10rem"
    @click="dialog = true"
    text="Log Activity"
    rounded="md"
  ></v-btn>

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
