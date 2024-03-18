<script setup lang="ts">
// side nav bars
import { useUserStore } from "../stores"

const userStore = useUserStore()

const links = [
  { display: "Home", to: { name: "home"}, icon: "mdi-home" },
  { display: "Tasks", to: { name: "tasks"}, icon: "mdi-format-list-checks" },
  { display: "Schedule", to: { name: "schedule"}, icon: "mdi-calendar" },
  { display: "Profile", to: { name: "profile"}, icon: "mdi-account" },
]
//

</script>
<template>
<v-navigation-drawer expand-on-hover rail>
    <v-list>
        <v-list-item prepend-icon="mdi-account" :title="userStore.user?.name"></v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list density="compact" nav>
        <v-list-item
            v-for="link in links"
            :key="link.display"
            :to="link.to"
            :title="link.display"
            :prepend-icon="link.icon"
            link
        ></v-list-item>
    </v-list>
</v-navigation-drawer>
</template>
