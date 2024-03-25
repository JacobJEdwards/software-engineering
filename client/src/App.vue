<script setup lang="ts">
import Header from "./components/Header.vue";

import { useRouter } from "vue-router";
import { computed } from "vue";
import { useAuthStore, useUserStore } from "./stores";
import Sidebar from "./components/Sidebar.vue";


const authStore = useAuthStore()
const router = useRouter();
const userStore = useUserStore()

const isLoginPage = computed(() => {
  return router.currentRoute.value.path === "/login" || router.currentRoute.value.path === "/signup"
});


const isAuth = computed(() => {
  return authStore.isLoggedIn
});

router.beforeEach(async (to, _, next) => {
  if (!isAuth.value && to.path !== "/login" && to.path !== "/signup") {
    next({
      path: "/login"
    });
  } else {
    next()
  }
});

router.afterEach(async () => {
  if (!isLoginPage.value && isAuth.value && !userStore.user) {
      try {
        await userStore.getUser()
      } catch (e) {
        console.error(e)
      }
  }
})

</script>

<template>
  <v-app>
    <Header v-if="!isLoginPage" />
    <Sidebar v-if="!isLoginPage" />
    <v-main>
    <router-view />
    </v-main>
  </v-app>
</template>

<style scoped>
</style>
