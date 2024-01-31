import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router'
import PrimeVue from 'primevue/config'

import 'primevue/resources/themes/aura-light-green/theme.css'

import Button from 'primevue/button';
import Menubar from 'primevue/menubar';

const app = createApp(App)
app.use(PrimeVue)
app.use(router)


app.component("Button", Button)
app.component("Menubar", Menubar)

app.mount("#app")

