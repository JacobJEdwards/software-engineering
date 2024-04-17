<script setup lang="ts">
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import LogActivity from "./components/LogActivity.vue";

import { useRouter } from "vue-router";
import { computed } from "vue";
import { useAuthStore, useUserStore } from "./stores";
import Navbar from "./components/Navbar.vue";

const authStore = useAuthStore();
const router = useRouter();
const userStore = useUserStore();

const isLoginPage = computed(() => {
  return (
    router.currentRoute.value.path === "/login" ||
    router.currentRoute.value.path === "/signup"
  );
});

const isAuth = computed(() => {
  return authStore.isLoggedIn;
});

router.beforeEach(async (to, _, next) => {
  if (!isAuth.value && to.meta.requiresAuth) {
    next({
      path: "/login",
    });
  } else {
    next();
  }
});

router.beforeEach(async () => {
  if (!isLoginPage.value && isAuth.value && !userStore.user) {
    try {
      await userStore.getUser();
    } catch (e) {
      console.error(e);
    }
  }
});
</script>

<template>
  <v-app>
    <Navbar v-if="isAuth" />
    <Header v-if="!isLoginPage" />
    <v-main>
      <router-view />
      <v-btn
        v-if="!isLoginPage && !isAuth"
        fab
        small
        color="primary"
        dark
        @click="router.push('/login')"
        icon="mdi-login"
        class="position-fixed bottom-20 right-10"
      />
      <LogActivity v-else-if="isAuth" />
    </v-main>
    <Footer />
  </v-app>
</template>

<style scoped></style>
