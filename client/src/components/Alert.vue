<script setup lang="ts">
// when called, make the alert appear

const props = defineProps<{
  type: string;
  message: string;
  visible: boolean;
  close: () => void;
}>();
</script>

<template>
  <v-snackbar
    v-model="props.visible"
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
    <v-btn icon="mdi-close" @click="props.close">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<style scoped></style>
