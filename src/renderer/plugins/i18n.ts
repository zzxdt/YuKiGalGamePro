import { createI18n } from 'vue-i18n'
import { getCurrentLocale } from '@/renderer/utils'
import zh from '@/renderer/locales/zh.json'
import en from '@/renderer/locales/en.json'
export default createI18n({
  legacy: false,
  locale: getCurrentLocale(),
  fallbackLocale: 'zh',
  globalInjection: true,
  messages: {
    en,
    zh
  }
})
