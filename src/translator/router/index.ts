import { createRouter, createWebHashHistory } from 'vue-router'
import { TranslateSettingPage, TranslatorHookPage, TranslatorPage } from '../components/index'
export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '',
      redirect: '/hook'
    },
    {
      path: '/translate',
      component: TranslatorPage
    },
    {
      path: '/hook',
      component: TranslatorHookPage
    },
    {
      path: '/setting',
      component: TranslateSettingPage
    }
  ]
})
