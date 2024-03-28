<script setup lang="ts">
import { useUserStore, useAuthStore } from "../stores"
import { useRouter } from "vue-router"

const userStore = useUserStore()
const authStore = useAuthStore()
const router = useRouter()

const links = [
  { display: "Home", to: { name: "home"}, icon: "mdi-home" },
  { display: "Tasks", to: { name: "tasks"}, icon: "mdi-format-list-checks" },
  { display: "Schedule", to: { name: "schedule"}, icon: "mdi-calendar" },
  { display: "Profile", to: { name: "profile"}, icon: "mdi-account" },
]

const logout = async () => {
  authStore.logout()
  await router.push("/login")
}
//

</script>
<template>
<v-navigation-drawer expand-on-hover rail class="full-height relative bg-grey-darken-4 pt-8">
    <v-list>
        <v-list-item prepend-icon="mdi-account" :title="userStore.user?.name ?? 'Unknown'"></v-list-item>
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
            class="hover:bg-gray-800 hover:text-white"
        ></v-list-item>
    </v-list>

  <template v-slot:append>
    <v-list dense nav>
      <v-list-item @click="logout"  prepend-icon="mdi-logout" title="Logout" link class="hover:bg-gray-800"></v-list-item>
    </v-list>
  </template>

</v-navigation-drawer>
</template>
