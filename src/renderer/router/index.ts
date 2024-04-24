import { createRouter, createWebHashHistory } from 'vue-router'
import {
  YkAboutPage,
  AddGamePageVue,
  DebugMessagesPageVue,
  GamePageHome,
  LibrarySettingsVue,
  LocaleChangerSettingsVue,
  SettingsPageVue,
  TranslatorSettingsVue,
  MyGameList,
  TextScreen
} from '@/renderer/components/layout'
export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '',
      redirect: '/games'
    },
    {
      path: '/games',
      component: GamePageHome,
      meta: {
        titleKey: 'title.main'
      }
    },
    {
      path: '/addgame',
      component: AddGamePageVue
    },
    {
      path: '/mygamelist',
      component: MyGameList
    },
    {
      path: '/textscreen',
      component: TextScreen
    },
    {
      path: '/setting',
      component: SettingsPageVue,
      children: [
        {
          path: 'localechanger',
          component: LocaleChangerSettingsVue
        },
        {
          path: 'library',
          component: LibrarySettingsVue
        },
        {
          path: 'translator',
          component: TranslatorSettingsVue
        }
      ]
    },
    {
      path: '/debugMessage',
      component: DebugMessagesPageVue
    },
    {
      path: '/about',
      component: YkAboutPage
    }
  ]
})
