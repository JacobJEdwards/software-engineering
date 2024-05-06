<script setup lang="ts">
import { useAuthStore, useUserStore } from "../../stores";
import { ref, watch } from "vue";
import { ActivitiesService } from "../../services";
import { useLoading, useSuccessErrorMessage } from "../..//utils/utils.ts";
import {
  TaskStatuses,
  ActivityForm,
  ActivityTypes,
} from "../../typings/user.ts";
import Alert from "../utils/Alert.vue";
import NumberInput from "../utils/NumberInput.vue";
</script>

<template></template>

<style scoped></style>
