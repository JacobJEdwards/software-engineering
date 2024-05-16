<script setup lang="ts">
const emit = defineEmits(["cancel", "confirm"]);

const props = defineProps({
  text: {
    type: String,
    default: "Are you sure?",
  },
  title: {
    type: String,
    default: "Confirm",
  },
});

const show = defineModel("show", {
  type: Boolean,
  default: false,
});

const confirm = () => {
  emit("confirm");
  show.value = false;
};

const cancel = () => {
  emit("cancel");
};
</script>

<template>
  <v-dialog v-model="show" max-width="400px">
    <v-card>
      <v-card-title class="headline">
        <slot name="title">
          {{ props.title }}
        </slot>
      </v-card-title>
      <v-card-text>
        <slot name="text">
          {{ props.text }}
        </slot>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="cancel" color="error">Cancel</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="confirm" color="success">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
