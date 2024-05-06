<script setup lang="ts">
import { useAuthStore, useUserStore } from "../../stores";
import { ref, watch } from "vue";
im;
import { useLoading, useSuccessErrorMessage } from "../..//utils/utils.ts";
import {
  Milestone,
  MilestoneTypes,
  MilestoneType,
} from "../../typings/user.ts";
import Alert from "../utils/Alert.vue";
import NumberInput from "../utils/NumberInput.vue";

const authStore = useAuthStore();
const userStore = useUserStore();

const { loading } = useLoading();
const { success, error } = useSuccessErrorMessage();

const show = defineModel("show", {
  type: Boolean,
  default: false,
});

const props = defineProps<
  {
    close: () => void;
  } & Partial<Milestone>
>();

const emit = defineEmits(["created"]);

const milestoneSelectTypes = Object.values(MilestoneTypes);

type FormData = {};

const formData = ref<FormData>({});

watch(
  () => props,
  () => {
    formData.value = {};
  },
  { deep: true },
);
</script>

<template></template>

<style scoped></style>
