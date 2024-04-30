<script setup lang="ts">
import { ref } from "vue";
// button with tooltip if disabled, says fill in all fields

const props = defineProps<{
  disabled: boolean;
  submit: () => void;
  text?: string;
  tooltip?: string;
}>();


</script>

<template>
  <v-btn
    :disabled="props.disabled"
    @click="props.submit"
    color="success"
    rounded="md"


</template>

<style scoped>

</style>