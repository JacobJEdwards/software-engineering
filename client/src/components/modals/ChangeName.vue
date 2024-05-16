<script setup lang="ts">
import { useAuthStore, useUserStore } from "../../stores";
import { ref } from "vue";
import { useSuccessErrorMessage } from "../../utils/utils.ts";
import { useLoading } from "../../utils/utils.ts";
import Alert from "../utils/Alert.vue";
import ConfirmModal from "./ConfirmModal.vue";

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

const name = ref<string>("");
const editPressed = ref<boolean>(false);

const closeForm = () => {
  name.value = "";
  error.value.message = "";
  error.value.show = false;
  success.value.message = "";
  success.value.show = false;
  props.close();
};

const changeName = async () => {
  loading.value = true;
  error.value.message = "";
  error.value.show = false;
  success.value.message = "";
  success.value.show = false;

  const result = {
    success: false,
    error: "Error",
  };

  if (result.success) {
    success.value.message = "Name changed successfully";
    success.value.show = true;
  } else {
    error.value.message = result.error ?? "Error changing name";
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
      <v-card-title class="headline">Change Name</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="name"
              label="Name"
              outlined
              required
              variant="solo-filled"
              type="text"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="closeForm" color="danger" :loading="loading"
          >Cancel</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn
          @click="editPressed = true"
          color="success"
          :loading="loading"
          :disabled="!name"
          >Change Name</v-btn
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
  <ConfirmModal
    v-model:show="editPressed"
    :text="`Are you sure you want to change your name to ${name}?`"
    @confirm="changeName"
    @close="editPressed = false"
  />
</template>

<style scoped></style>
