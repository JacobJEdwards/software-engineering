import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router'
import PrimeVue from 'primevue/config'
import VueCookies from 'vue-cookies'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { md3 } from "vuetify/blueprints";
import { createPinia } from 'pinia'
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light'
  },
  blueprint: md3
})

const pinia = createPinia()
pinia.use(piniaPluginPersistedState)

import 'primevue/resources/themes/aura-light-green/theme.css'

const app = createApp(App)
app.use(VueCookies)
app.use(PrimeVue)
app.use(router)
app.use(vuetify)
app.use(pinia)

app.mount("#app")

