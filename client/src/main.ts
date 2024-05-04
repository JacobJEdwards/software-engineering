import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { router } from "./router";
import PrimeVue from "primevue/config";
import VueCookies from "vue-cookies";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { VNumberInput, VDateInput } from "vuetify/labs/components";
import { md3 } from "vuetify/blueprints";
import { createPinia } from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import "@mdi/font/css/materialdesignicons.css";
import colors from "vuetify/util/colors";

// add custom colors
const vuetify = createVuetify({
  components: {
    VNumberInput,
    VDateInput,
    ...components,
  },
  directives,
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        colors: {
          primary: colors.grey.darken4,
          secondary: colors.blue.darken3,
          accent: "#ed61ba",
          error: "#FF5252",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FFC107",
        },
      },
    },
  },
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  blueprint: md3,
});

const pinia = createPinia();
pinia.use(piniaPluginPersistedState);

import "primevue/resources/themes/aura-light-green/theme.css";

const app = createApp(App);
app.use(VueCookies);
app.use(PrimeVue);
app.use(router);
app.use(vuetify);
app.use(pinia);

app.mount("#app");
