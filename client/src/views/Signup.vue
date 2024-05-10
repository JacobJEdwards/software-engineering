<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useLoading, useSuccessErrorMessage } from "../utils/utils.ts";
import { emailRules } from "../utils/form.ts";
import { useDisplay } from "vuetify";
import { signup } from "../services/auth.ts";
import { useAuthStore } from "../stores";
import Alert from "../components/utils/Alert.vue";

const router = useRouter();
const authStore = useAuthStore();

const { loading } = useLoading();
const { success, error } = useSuccessErrorMessage();

const name = ref<string>("");
const email = ref<string>("");
const password = ref<string>("");
const showPassword = ref<boolean>(false);

const isSuccessful = ref<boolean>(false);

const { mdAndDown } = useDisplay();

const submitForm = async () => {
  loading.value = true;
  error.value.message = "";
  error.value.show = false;
  success.value.message = "";
  success.value.show = false;

  const result = await signup(name.value, email.value, password.value);

  if (!result.success) {
    error.value.message = result.error ?? "Error on signup";
    error.value.show = true;
    loading.value = false;
    password.value = "";
    return;
  }

  success.value.message = "Signup successful";
  success.value.show = true;
  authStore.email = email.value;
  isSuccessful.value = true;

  await redirectToLogin();

  loading.value = false;
};

const redirectToLogin = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  await router.push("/login");
};
</script>

<template>
  <v-container class="h-full d-flex justify-center align-center">
    <v-row align="center" justify="center">
      <v-col
        cols="12"
        md="6"
        v-if="!mdAndDown"
        class="hidden md:block d-flex justify-center align-center"
      >
        <img src="../assets/zigs.jpeg" alt="ZigPhoto" class="w-96 h-96" />
      </v-col>
      <v-col cols="12" md="6" v-if="!isSuccessful">
        <v-row>
          <v-form @submit.prevent="submitForm" class="w-full">
            <v-col cols="12" class="text-center">
              <h1 class="text-3xl font-bold">Sign up</h1>
              <p class="text-sm mt-2 text-gray-400">
                Sign up now to create an account
              </p>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="name"
                placeholder="John Doe"
                label="Name"
                outlined
                append-inner-icon="mdi-account"
                variant="solo-filled"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="email"
                placeholder="john.doe@email.com"
                :rules="emailRules"
                label="Email"
                type="email"
                outlined
                append-inner-icon="mdi-email"
                variant="solo-filled"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="password"
                label="Password"
                :type="showPassword ? 'text' : 'password'"
                outlined
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword = !showPassword"
                variant="solo-filled"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-btn
                :loading="loading"
                color="secondary"
                rounded="sm"
                aria-required="true"
                type="submit"
                block
                :disabled="!name || !email || !password"
                >Sign up</v-btn
              >
            </v-col>
            <v-col cols="12" class="text-center">
              <p class="text-sm text-gray-400">
                Already have an account?
                <router-link
                  to="/login"
                  class="text-blue-500 text-sm hover:text-blue-700 focus:outline-none"
                  >Log in</router-link
                >
              </p>
            </v-col>
          </v-form>
        </v-row>
      </v-col>
      <v-col cols="12" md="6" v-else>
        <v-empty-state
          class="text-center"
          icon="mdi-check-circle"
          title="Signup successful"
        >
          <template #text>
            <p class="text-sm text-gray-400">
              You will be redirected to the
              <router-link
                to="/login"
                class="text-blue-500 text-sm hover:text-blue-700 focus:outline-none"
                >login page</router-link
              >
              in a few seconds.
            </p>
          </template>
        </v-empty-state>
      </v-col>
    </v-row>
    <Alert
      type="success"
      :show="success.show"
      :message="success.message"
      :close="() => (success.show = false)"
    />
    <Alert
      type="error"
      :show="error.show"
      :message="error.message"
      :close="() => (error.show = false)"
    />
  </v-container>
</template>

<style scoped></style>
