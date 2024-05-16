<script setup lang="ts">
import { useUserStore, useAuthStore } from "../stores";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";
import { ref } from "vue";

const drawer = ref<boolean>(false);

const userStore = useUserStore();
const authStore = useAuthStore();
const router = useRouter();
const { mdAndDown } = useDisplay();

const links = [
  { display: "Home", to: { name: "home" }, icon: "mdi-home" },
  { display: "Schedule", to: { name: "schedule" }, icon: "mdi-calendar" },
  { display: "Tasks", to: { name: "tasks" }, icon: "mdi-format-list-checks" },
  { display: "Milestones", to: { name: "milestones" }, icon: "mdi-flag" },
  { display: "Modules", to: { name: "modules" }, icon: "mdi-book" },
  { display: "Profile", to: { name: "profile" }, icon: "mdi-account" },
  { display: "Stats", to: { name: "stats" }, icon: "mdi-chart-bar" },
];

const logout = async () => {
  authStore.logout();
  await router.push("/login");
};
</script>

<template>
  <v-navigation-drawer
    expand-on-hover
    rail
    class="full-height relative pt-8"
    v-if="!mdAndDown"
    color="secondary"
  >
    <v-list>
      <v-list-item
        prepend-icon="mdi-account"
        :title="userStore.user?.name ?? 'Unknown'"
      ></v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>
      <v-list-item
        v-for="link in links"
        :key="link.display"
        :to="link.to"
        :prepend-icon="link.icon"
        link
        class="font-bold my-4"
      >
        <template #title>
          <span class="font-bold my-4">{{ link.display }}</span>
        </template>
      </v-list-item>
    </v-list>

    <template #append>
      <v-list dense nav>
        <v-list-item
          @click="logout"
          prepend-icon="mdi-logout"
          title="Logout"
          link
          class="hover:bg-gray-800"
        ></v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>

  <v-app-bar app v-if="mdAndDown" dark color="secondary">
    <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    <v-toolbar-title>Wonderful Tasks</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-app-bar>
  <v-navigation-drawer
    v-model="drawer"
    app
    color="secondary"
    dark
    v-if="mdAndDown"
  >
    <v-list>
      <v-list-item
        prepend-icon="mdi-account"
        :title="userStore.user?.name ?? 'Unknown'"
      ></v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list dense nav>
      <v-list-item
        v-for="link in links"
        :key="link.display"
        :to="link.to"
        :title="link.display"
        :prepend-icon="link.icon"
        link
        class="hover:bg-gray-800 hover:text-white"
      ></v-list-item>
    </v-list>

    <template #append>
      <v-list dense nav>
        <v-list-item
          @click="logout"
          prepend-icon="mdi-logout"
          title="Logout"
          link
          class="hover:bg-gray-800"
        ></v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>
