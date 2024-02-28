<script setup lang="ts">
import Header from "./components/Header.vue";

import { useRouter } from "vue-router";
import { computed } from "vue";
import { useStore } from "./store"

const store = useStore()
const router = useRouter();

const isLoginPage = computed(() => {
  return router.currentRoute.value.path === "/login" || router.currentRoute.value.path === "/signup"
});

const isAuth = computed(() => {
  return !!store.getters["user/token"]
});

router.beforeEach((to, _, next) => {
  if (!isAuth.value && to.path !== "/login" && to.path !== "/signup") {
    next({
      path: "/login"
    });
  } else {
    next()
  }
});

</script>

<template>
  <v-app>
    <Header v-if="!isLoginPage" />
    <v-main>
    <router-view />
    </v-main>
  </v-app>
</template>

<style scoped>
</style>
