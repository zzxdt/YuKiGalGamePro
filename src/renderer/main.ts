import { createApp, Directive, nextTick } from 'vue'
import { createPinia } from 'pinia'
import { Vuetify3Dialog } from 'vuetify3-dialog'
import App from '@/renderer/App.vue'
import vuetifyInstance from './plugins/vuetify'
import router from '@/renderer/router'
import translatorRouter from '@/translator/router'
import vuetify from '@/renderer/plugins/vuetify'
import i18n from '@/renderer/plugins/i18n'
import axios from 'axios'
import TranslatorApp from '../translator/App.vue'
import { configIpcService } from '@/ipcServer/configIpcService'
import 'animate.css';
// Add API key defined in contextBridge to window object type
declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    mainApi?: any
  }
}
const watchContent: Directive = {
  mounted(el, binding) {
    const config = { childList: true, subtree: true };
    const callback = function (mutationsList, observer) {
      if (binding.value && typeof binding.value === 'function') {
        binding.value(mutationsList, observer);
      }
    };
    const observer = new MutationObserver(callback);
    nextTick(() => {
      observer.observe(el, config);
    });
    el._watchContentObserver = observer;
  },
  unmounted(el) {
    if (el._watchContentObserver) {
      el._watchContentObserver.disconnect();
      delete el._watchContentObserver;
    }
  }
};
const RootComponent = window.location.pathname.startsWith('/translator') ? TranslatorApp : App
const app = createApp(RootComponent)
const MainOrTranslatorRouter = window.location.pathname.startsWith('/translator') ? translatorRouter : router
app.use(vuetify).use(i18n).use(MainOrTranslatorRouter).use(createPinia()).use(Vuetify3Dialog, {
  vuetify: vuetifyInstance,
  defaults: {
  }
})
//全局设置http
app.config.globalProperties.$http = axios;
app.directive('watch-content', watchContent);
app.mount('#app')

