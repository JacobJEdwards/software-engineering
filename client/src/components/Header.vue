<script setup lang="ts">
import { useRouter } from "vue-router"
const items = [
        {
          label: "Home",
          icon: "pi pi-home",
          route: "/",
        },
        {
          label: "Schedule",
          icon: "pi pi-info-circle",
          route: "/schedule",
        },
]

const router = useRouter();

const logout = () => {
    $cookies.remove("auth")
    router.push("/login");
}
</script>

<template>
  <div class="header">
    <Menubar :model="items">
      <template #item="{ item, props, hasSubmenu }">
        <router-link
          v-if="item.route"
          v-slot="{ href, navigate }"
          :to="item.route"
          custom
        >
          <a v-ripple :href="href" v-bind="props.action" @click="navigate">
            <span :class="item.icon" />
            <span class="ml-2">{{ item.label }}</span>
          </a>
        </router-link>
        <a
          v-else
          v-ripple
          :href="item.url"
          :target="item.target"
          v-bind="props.action"
        >
          <span :class="item.icon" />
          <span class="ml-2">{{ item.label }}</span>
          <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down ml-2" />
        </a>
      </template>
    </Menubar>
      <Button @click="logout">Logout</Button>
  </div>
</template>


<style scoped>
.header {
  background-color: #42b983;
  padding: 10px;
  text-align: center;
}
</style>
