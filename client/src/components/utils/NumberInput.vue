<script setup lang="ts">
const value = defineModel("value", {
  type: Number,
  default: 0,
});

const props = defineProps<{
  min?: number;
  max?: number;
  label: string;
  required?: boolean;
  disabled?: boolean;
  hint?: string;
  loading?: boolean;
  persistentHint?: boolean;
}>();

const emit = defineEmits(["update:value"]);
</script>

<template>
  <v-number-input
    v-model.number="value"
    type="number"
    control-variant="stacked"
    variant="solo-filled"
    :label="props.label"
    :min="props.min"
    :max="props.max"
    :hint="props.hint"
    :required="props.required ?? false"
    :disabled="props.disabled ?? false"
    :loading="props.loading ?? false"
    :persistent-hint="props.persistentHint ?? false"
    @update:model-value="emit('update:value', $event)"
  >
    <template #increment="{ click }">
      <v-btn
        icon="mdi-plus"
        @click="click"
        aria-label="Increment"
        color="primary"
        variant="text"
      >
      </v-btn>
    </template>
    <template #decrement="{ click }">
      <v-btn
        icon="mdi-minus"
        @click="click"
        aria-label="Decrement"
        color="primary"
        variant="text"
      >
      </v-btn>
    </template>
  </v-number-input>
</template>

<style scoped></style>
