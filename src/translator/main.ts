import vuetify from '@/renderer/plugins/vuetify'
import axios from 'axios'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import i18n from '@/renderer/plugins/i18n'
import 'animate.css'
import { createPinia } from 'pinia'
declare global {
  // eslint-disable-next-line no-unused-vars
  interface TranslatorWindows {
    mainApi?: any
  }
}
const app = createApp(App)
app.use(vuetify).use(i18n).use(router).use(createPinia())
app.config.globalProperties.$http = axios
app.mount('#app')
