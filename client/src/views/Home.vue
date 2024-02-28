<script setup lang="ts">
import Task from "../components/Task.vue"
import { useLoading } from "../utils/utils.ts"
import { useUserStore } from "../stores/user.ts"
import { onMounted} from "vue";

const { loading } = useLoading()

const store = useUserStore()

const init = async () => {
  const user = store.user;

  if (!user) {
    loading.value = true;
    await store.getUser()
    loading.value = false;
  }
}

onMounted(init)

</script>

<template>
  <!-- move into component -->
  <v-container v-if="loading">

  </v-container>
  <v-container v-else>

  </v-container>

</template>