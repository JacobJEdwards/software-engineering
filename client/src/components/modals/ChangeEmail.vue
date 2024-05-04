<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore, useUserStore } from "../../stores";
import { useSuccessErrorMessage, useLoading } from "../../utils/utils.ts";
import Alert from "../utils/Alert.vue";

const { success, error } = useSuccessErrorMessage();
const { loading } = useLoading();

const show = defineModel("show", {
  type: Boolean,
  default: false,
});

const props = defineProps<{
  close: () => void;
}>();

const authStore = useAuthStore();
const userStore = useUserStore();

const email = ref<string>("");
const emailConfirm = ref<string>("");

const changeEmail = async () => {
  loading.value = true;
  error.value.message = "";
  error.value.show = false;
  success.value.message = "";
  success.value.show = false;

  if (email.value !== emailConfirm.value) {
    error.value.message = "Emails do not match";
    error.value.show = true;
    loading.value = false;
    return;
  }

  const result = {
    success: false,
    error: "Error",
  };

  if (result.success) {
    success.value.message = "Email changed successfully";
    success.value.show = true;
  } else {
    error.value.message = result.error ?? "Error changing email";
    error.value.show = true;
  }

  loading.value = false;
};
</script>

<template>
  <v-dialog
    v-model="show"
    max-width="500"
    scrollable
    class="p-4"
    max-height="600px"
    @click:outside="props.close"
  >
    <v-card>
      <v-card-title class="headline">Change Email</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="email"
              label="Email"
              outlined
              required
              variant="solo-filled"
              type="email"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="emailConfirm"
              label="Confirm Email"
              outlined
              required
              variant="solo-filled"
              type="email"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="props.close" color="danger" :loading="loading"
          >Cancel</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn
          @click="changeEmail"
          color="success"
          :loading="loading"
          :disabled="!email || !emailConfirm"
          >Change Email</v-btn
        >
      </v-card-actions>
      <Alert
        type="error"
        v-model:show="error.show"
        :message="error.message"
        :close="() => (error.show = false)"
      />
      <Alert
        type="success"
        v-model:show="success.show"
        :message="success.message"
        :close="() => (success.show = false)"
      />
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
