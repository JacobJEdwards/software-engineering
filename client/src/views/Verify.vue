<script setup lang="ts">
import { useRouter } from "vue-router";
import { AuthService } from "../services";
import { useSuccessErrorMessage, useLoading } from "../utils/utils.ts";
import Alert from "../components/utils/Alert.vue";

const router = useRouter();
const { loading } = useLoading();
const { success, error } = useSuccessErrorMessage();

const verify = async () => {
  loading.value = true;
  const token = router.currentRoute.value.query.token ?? "";
  const id = router.currentRoute.value.query.userId ?? "";

  const result = await AuthService.verifyEmail(token, id);

  if (result.success) {
    success.value.message = "Email verified";
    success.value.show = true;
    await router.push({ name: "login" });
  } else {
    error.value.message = result.error ?? "Error verifying email";
    error.value.show = true;
  }

  loading.value = false;
};
</script>

<template>
  <v-container>
    <v-empty-state icon="mdi-email-check">
      <template #title> Verify Email </template>
      <template #text>
        <p>Please click to confirm your email address</p>
        <v-btn
          @click="verify"
          color="secondary"
          :loading="loading"
          rounded="md"
          class="mt-8"
        >
          Verify Email
        </v-btn>
      </template>
    </v-empty-state>
    <Alert
      type="success"
      :message="success.message"
      :close="() => (success.show = false)"
      v-model:show="success.show"
    />
    <Alert
      type="error"
      :message="error.message"
      :close="() => (error.show = false)"
      v-model:show="error.show"
    />
  </v-container>
</template>

<style scoped></style>
