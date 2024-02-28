<script setup lang="ts">
import Task from "../components/Task.vue"
import { VueCookies } from "vue-cookies";
import { useRouter } from "vue-router"
import { inject, ref } from "vue"
import { API_ROUTE } from "../config.ts"

const loading = ref(true)

const $cookies = inject<VueCookies>("$cookies");
const router = useRouter()

const getUserInfo = async () => {
  const token = $cookies?.get("auth");
  if (!token) {
    await router.push("/login");
    return;
  }
  try {

    const data = $cookies?.get("user-info")

    if (data) {
      return JSON.parse(data);
    }

    const res = await fetch(`${API_ROUTE}/user`, {
      headers: {
        "Authorization": token
      }
    })

    if (!res.ok) {
      throw new Error("Error fetching")
    }

    const userData = await res.json();
    $cookies?.set("user-info", JSON.stringify(userData))

    return userData;
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <!-- move into component -->
  <v-container v-if="loading">

  </v-container>
  <v-container v-else>

  </v-container>

</template>