import { stat } from 'original-fs'
import { defineStore } from 'pinia'
const TranslatorConfigStore = defineStore('TranslatorConfigState', {
  state: () => ({
    default: {} as yuki.TranslatorConfigState['default'],
    isSavingConfig: false,
    translatorWindow: {
      bounds: {
        x: 268,
        y: 43,
        width: 998,
        height: 432
      },
      originalText: {
        fontSize: 1.5,
        color: 'white'
      },
      translationText: {
        fontSize: 1.5,
        color: 'white',
        margin: 0.7
      },
      sizes: {
        '/translate': { x: 192, y: 86, width: 998, height: 216 },
        '/hook': { x: 192, y: 86, width: 998, height: 432 },
        '/setting': { x: 192, y: 86, width: 998, height: 540 }
      },
      mecabText: {
        fontSize: 1.5,
        fontPadding: 0.3
      },
      mecabReading: {
        fontSize: 0.6
      },
      background: '#000000BD',
      renderMode: 'transparent'
    } as yuki.TranslatorConfigState['translatorWindow']
  }),
  getters: {
    getOriginalText: (state) => {
      return state.translatorWindow.originalText
    },
    getTranslationText: (state) => {
      return state.translatorWindow.translationText
    },
    getMecabText: (state) => {
      return state.translatorWindow.mecabText
    },
    getMecabReading: (state) => {
      return state.translatorWindow.mecabReading
    },
    getbackgroundColor: (state) => {
      return state.translatorWindow.background
    },
    getbounds: (state) => {
      return state.translatorWindow.bounds
    },
    getSize: (state) => {
      return state.translatorWindow.sizes
    },
    getMecabIsEnable: (state) => {
      return state.default.mecab
    },
    getRedisIsEnable: (state) => {
      return state.default.redis
    },
    getAnkiIsEnable: (state) => {
      return state.default.anki
    }
  },
  actions: {
    setConfig(payload: { name: string; cfgs: any }) {
      switch (payload.name) {
        case 'default':
          this.default = payload.cfgs
          break
        case 'gui':
          this.translatorWindow = payload.cfgs
          break
        default:
          console.log(
            'invalid config name: %s',
            JSON.stringify(payload.name),
            'config is:',
            JSON.stringify(payload.cfgs)
          )
          break
      }
    },
    setWindows(payload: { width: number; height: number }) {
      this.translatorWindow.bounds.width = payload.width
      this.translatorWindow.bounds.height = payload.height
    },
    setOriginalTextSize(preload: { size: number }) {
      this.translatorWindow.originalText.fontSize = preload.size
    },
    setMecabTextSize(preload: { size: number }) {
      this.translatorWindow.mecabText.fontSize = preload.size
    },
    setMecaReadingSize(preload: { size: number }) {
      this.translatorWindow.mecabReading.fontSize = preload.size
    },
    setTranslationTextSize(preload: { size: number }) {
      this.translatorWindow.translationText.fontSize = preload.size
    },
    setMecabFontPadding(preload: { padding: number }) {
      this.translatorWindow.mecabText.fontPadding = preload.padding
    },
    setOriginalTextColor(preload: { color: string }) {
      this.translatorWindow.originalText.color = preload.color
    },
    setTranslationTextColor(preload: { color: string }) {
      this.translatorWindow.translationText.color = preload.color
    },
    setTranslationTextMargin(preload: { margin: number }) {
      this.translatorWindow.translationText.margin = preload.margin
    },
    setbackgroundColor(preload: { color: string }) {
      this.translatorWindow.background = preload.color
    },
    saveConfig() {
      const mtranslatorWindow = this.translatorWindow
      window.mainApi.requestSaveConfig('gui', JSON.stringify(mtranslatorWindow))
    },
    updateRouteSize(path: string) {
      this.translatorWindow.sizes[path] = { ...this.translatorWindow.bounds }
    }
  }
})
export { TranslatorConfigStore }
