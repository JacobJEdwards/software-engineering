<script setup lang="ts">
const show = defineModel("show", {
  type: Boolean,
  default: false,
});

const props = defineProps<{
  type: string;
  message: string;
  close: () => void;
}>();
</script>

<template>
  <v-snackbar
    v-model="show"
    :color="props.type"
    :timeout="3000"
    :top="true"
    :right="true"
    :absolute="true"
    :multi-line="true"
    :vertical="true"
    :rounded="true"
    :dark="true"
    @click="props.close"
  >
    {{ props.message }}
    <v-btn icon="mdi-close" @click="props.close" variant="text"></v-btn>
  </v-snackbar>
</template>

<style scoped></style>
