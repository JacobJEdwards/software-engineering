import { createApp } from "vue";
import "./style.css";
//import App from "./App.vue";
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

const colorBlindLightTheme ={
  dark: false,
  colors: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    'surface-bright': '#FFFFFF',
    'surface-light': '#EEEEEE',
    'surface-variant': '#424242',
    'on-surface-variant': '#EEEEEE',
    primary: '#1867C0',
    'primary-darken-1': '#1F5592',
    secondary: '#48A9A6',
    'secondary-darken-1': '#018786',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  },
  variables: {
    'border-color': '#000000',
    'border-opacity': 0.12,
    'high-emphasis-opacity': 0.90,
    'medium-emphasis-opacity': 0.90,
    'disabled-opacity': 0.38,
    'idle-opacity': 0.04,
    'hover-opacity': 0.02,
    'focus-opacity': 0.12,
    'selected-opacity': 0.08,
    'activated-opacity': 0.12,
    'pressed-opacity': 0.12,
    'dragged-opacity': 0.08,
    'theme-kbd': '#212856',
    'theme-on-kbd': '#FFFFFF',
    'theme-code': '#F5F5F5',
    'theme-on-code': '#000000',
  }

}

const colorBlindDarkTheme = {
  dark: true,
  colors: {
    background: '#121212',
    surface: '#1E1E1E',
    'surface-bright': '#2C2C2C',
    'surface-light': '#333333',
    'surface-variant': '#424242',
    'on-surface-variant': '#EEEEEE',
    primary: '#1867C0',
    'primary-darken-1': '#1F5592',
    secondary: '#48A9A6',
    'secondary-darken-1': '#018786',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
  },
  variables: {
    'border-color': '#FFFFFF',
    'border-opacity': 0.12,
    'high-emphasis-opacity': 0.87,
    'medium-emphasis-opacity': 0.90,
    'disabled-opacity': 0.38,
    'idle-opacity': 0.04,
    'hover-opacity': 0.02,
    'focus-opacity': 0.12,
    'selected-opacity': 0.08,
    'activated-opacity': 0.12,
    'pressed-opacity': 0.12,
    'dragged-opacity': 0.08,
    'theme-kbd': '#FFFFFF',
    'theme-on-kbd': '#212529',
    'theme-code': '#212529',
    'theme-on-code': '#F5F5F5',
  }
};


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
          secondary: "#15385f",
          accent: "#d32d7d",
          task: "#f757c03",
          milestones: "#49a078",
          modules: "#41c40f",
          semester: "#f7c41f",
          error: "#FF5252",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FFC107",
        },
      },
      colorBlindLightTheme, colorBlindDarkTheme
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
