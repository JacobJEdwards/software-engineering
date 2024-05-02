<script setup lang="ts"></script>

<template>
  <v-empty-state
    headline="Error 404"
    title="Page not found"
    icon="mdi-alert-circle"
  >
    <template #text>
      <p class="text-sm text-gray-400">
        The page you are looking for does not exist. Please check the URL or
        navigate back to the
        <router-link
          to="/"
          class="text-blue-500 text-sm hover:text-blue-700 focus:outline-none"
          >home page</router-link
        >.
      </p>
    </template>
  </v-empty-state>
</template>

<style scoped></style>
