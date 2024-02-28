<script setup lang="ts">
import Task from "../components/Task.vue"
import { useLoading } from "../utils/utils.ts"
import { useStore } from "../store"
import { onMounted} from "vue";

const { loading } = useLoading()

const store = useStore()

const init = async () => {
  const user = store.getters.user

  if (!user) {
    loading.value = true;
    await store.dispatch("user/getUser")
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