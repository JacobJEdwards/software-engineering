<script setup lang="ts">
import { useUserStore } from "../../stores";
import { ref } from "vue";
import { useSuccessErrorMessage } from "../../utils/utils.ts";
import { useLoading } from "../../utils/utils.ts";
import type { Semester } from "../../typings/user";
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

const userStore = useUserStore();

const currentSemester = ref<Semester | null>(userStore.currentSemester);
const semesters = ref<Semester[]>(userStore.user?.semester ?? []);
const selectedSemester = ref<string | null>(
  userStore.currentSemester?._id ?? null,
);

const changeSelectedSemester = () => {
  const newSemester = semesters.value.find(
    (s) => s._id === selectedSemester.value,
  );

  if (newSemester) {
    currentSemester.value = newSemester;
  }
};

const changeSemester = () => {
  loading.value = true;
  error.value.message = "";
  error.value.show = false;
  success.value.message = "";
  success.value.show = false;

  if (selectedSemester.value) {
    userStore.changeSemester(currentSemester.value);
    success.value.message = "Semester changed successfully";
    success.value.show = true;
  } else {
    error.value.message = "Error changing semester";
    error.value.show = true;
  }

  loading.value = false;
};

userStore.$subscribe(() => {
  currentSemester.value = userStore.currentSemester;
  semesters.value = userStore.user?.semester ?? [];
  selectedSemester.value = userStore.currentSemester?._id ?? null;
});
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
            <div v-if="!currentSemester">
              <p class="text-lg mb-4">No semesters uploaded!</p>
              <p class="text-sm text-gray-400">
                Upload a schedule in the
                <router-link
                  to="/profile"
                  class="text-blue-500 text-sm hover:text-blue-700 focus:outline-none"
                  >profile page.</router-link
                >
              </p>
            </div>
            <v-select
              v-else
              v-model="selectedSemester"
              :items="semesters"
              item-title="semesterName"
              item-value="_id"
              label="Semester"
              outlined
              variant="solo-filled"
              @update:model-value="changeSelectedSemester"
              required
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="props.close" color="danger" :loading="loading"
          >Cancel</v-btn
        >
        <v-spacer></v-spacer>
        <v-btn
          @click="changeSemester"
          color="success"
          :loading="loading"
          :disabled="!selectedSemester"
          >Change Semester</v-btn
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
