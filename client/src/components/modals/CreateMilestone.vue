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

type FormData = {
  title: string;
  type: string;
  progress: number;
  startDate: Date;
  endDate: Date;
};

const formData = ref<FormData>({
  title: props.milestoneTitle ?? "",
  type: props.milestoneType ?? "",
  progress: props.milestoneProgress ?? 0,
  startDate: props.startDate ?? new Date(Date.now()),
  endDate: props.endDate ?? new Date(Date.now()),
});

watch(
  () => props,
  () => {
    formData.value = {
      title: props.milestoneTitle ?? "",
      type: props.milestoneType ?? "",
      progress: props.milestoneProgress ?? 0,
      startDate: props.startDate ?? new Date(Date.now()),
      endDate: props.endDate ?? new Date(Date.now()),
    };
  },
  { deep: true },
);
</script>

<template></template>

<style scoped></style>
