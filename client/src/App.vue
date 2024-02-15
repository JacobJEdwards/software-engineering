<script lang="ts">
import Header from "./components/Header.vue";

export default {
  components: {
    Header,
  },
  computed: {
  isLoginPage() {
    return this.$route.name === 'login' || this.$route.name == "signup"
  }
  }
};
</script>

<template>
  <div id="app">
    <Header v-if="!isLoginPage" />
    <router-view />
  </div>
</template>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px; /* Adjust the margin to accommodate the header height */
}
</style>
