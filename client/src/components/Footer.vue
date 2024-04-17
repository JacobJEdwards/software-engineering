<script setup lang="ts">
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";

const router = useRouter();
const { mdAndDown } = useDisplay();

const socials = [
  {
    icon: "mdi-facebook",
    color: "white",
    click: () => router.push("www.facebook.com"),
  },
  {
    icon: "mdi-twitter",
    color: "white",
    click: () => router.push("www.x.com"),
  },
  {
    icon: "mdi-linkedin",
    color: "white",
    click: () => router.push("www.linkdin.com"),
  },
  {
    icon: "mdi-github",
    color: "white",
    click: () => router.push("www.github.com"),
  },
];

const links = [
  { text: "About Us", color: "white", click: () => router.push("/about") },
  { text: "Contact Us", color: "white", click: () => router.push("/contact") },
  {
    text: "Privacy Policy",
    color: "white",
    click: () => router.push("/privacy"),
  },
  {
    text: "Terms & Conditions",
    color: "white",
    click: () => router.push("/terms"),
  },
];
</script>

<template>
  <v-footer app class="bg-grey-darken-4" dark>
    <v-row align="center" class="pl-6" v-if="!mdAndDown">
      <v-col>
        <v-btn
          variant="text"
          v-for="social in socials"
          :key="social.icon"
          :icon="social.icon"
          color="white"
          @click="social.click"
        ></v-btn>
      </v-col>
      <v-col>
        <v-btn
          variant="text"
          v-for="link in links"
          :key="link.text"
          color="white"
          @click="link.click"
          >{{ link.text }}</v-btn
        >
      </v-col>
    </v-row>
    <v-row align="center" class="pl-6" v-else>
      <v-col>
        <v-btn
          variant="text"
          v-for="social in socials"
          :key="social.icon"
          :icon="social.icon"
          color="white"
          @click="social.click"
        ></v-btn>
      </v-col>
    </v-row>
  </v-footer>
</template>
