<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useLoading, useSuccessErrorMessage } from "../utils/utils.ts";
import { emailRules } from "../utils/form.ts";
import { useUserStore, useAuthStore } from "../stores";
import { useDisplay } from "vuetify";
import { login } from "../services/auth.ts";

const { loading } = useLoading();
const router = useRouter();
const userStore = useUserStore();
const authStore = useAuthStore();
const { error, success } = useSuccessErrorMessage();

const email = ref<string>(authStore.email ?? "");
const password = ref<string>("");
const showPassword = ref<boolean>(false);

const { mdAndDown } = useDisplay();

const submitForm = async () => {
  loading.value = true;
  error.value.message = "";
  error.value.show = false;
  success.value.message = "";
  success.value.show = false;

  const result = await login(email.value, password.value);

  if (!result.success || !result.data) {
    error.value.message = result.error ?? "Error on login";
    error.value.show = true;
    loading.value = false;
    return;
  }

  authStore.login(result.data);
  authStore.email = email.value;

  success.value.message = "Login successful";
  success.value.show = true;

  await userStore.getUser();
  await router.push("/");

  loading.value = false;
};
</script>

<template>
  <v-container class="h-full d-flex justify-center align-center">
    <v-row align="center" justify="center" class="">
      <v-col
        cols="12"
        md="6"
        v-if="!mdAndDown"
        class="hidden md:block d-flex justify-center align-center"
      >
        <img src="../assets/zigs.jpeg" alt="ZigPhoto" class="w-96 h-96" />
      </v-col>
      <v-col cols="12" md="6" class="">
        <v-row>
          <v-form @submit.prevent="submitForm" class="w-full">
            <v-col cols="12" class="text-center">
              <h1 class="text-3xl font-bold">Log in</h1>
              <p class="text-sm mt-2 text-gray-400">
                Welcome back! Log in to your account
              </p>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="email"
                placeholder="email@email.com"
                :rules="emailRules"
                label="Email"
                type="email"
                outlined
                append-inner-icon="mdi-email"
                variant="solo-filled"
                aria-required="true"
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
                aria-required="true"
              ></v-text-field>
              <p class="text-sm text-gray-400">
                Forgot password?
                <router-link
                  to="/forgot-password"
                  class="text-blue-500 text-sm hover:text-blue-700 focus:outline-none"
                >
                  Reset password
                </router-link>
              </p>
            </v-col>
            <v-col cols="12">
              <v-btn
                :loading="loading"
                color="secondary"
                rounded="sm"
                block
                type="submit"
                text="Login"
                :disabled="!email || !password"
              />
            </v-col>
            <v-col cols="12">
              <v-alert v-if="error.show" type="error" dismissible>{{
                error.message
              }}</v-alert>
              <v-alert v-if="success.show" type="success" dismissible>{{
                success.message
              }}</v-alert>
            </v-col>
            <v-col cols="12" class="text-center">
              <p class="text-sm text-gray-400">
                New user?
                <router-link
                  to="/signup"
                  class="text-blue-500 text-sm hover:text-blue-700 focus:outline-none"
                  >Sign up
                </router-link>
              </p>
            </v-col>
          </v-form>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
