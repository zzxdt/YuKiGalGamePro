import { defineStore } from 'pinia'
const TranslatorViewStore = defineStore('TranslatorViewState', {
  state: () => ({
    isAlwaysOnTop: true,
    pauseNewText: false,
    showNavigation: false,
    pauseTranslation: false,
    IsSaveConfig: false,
    originalTextVisiable: true
  }),
  getters: {
    getOriginalTextVisiable: (state) => {
      return state.originalTextVisiable
    },
    getPauseTranslation: (state) => {
      return state.pauseTranslation
    },
    getIsAlwaysOnTop: (state) => {
      return state.isAlwaysOnTop
    },
    getPauseNewText: (state) => {
      return state.pauseNewText
    },
    getShowNavigation: (state) => {
      return state.showNavigation
    },
    getIsSaveConfig: (state) => {
      return state.IsSaveConfig
    }
  },
  actions: {
    setNavigation(value: boolean) {
      this.showNavigation = value
    },
    setPauseNewText(value: boolean) {
      this.pauseNewText = value
    },
    setIsAlwaysOnTop(value: boolean) {
      this.isAlwaysOnTop = value
    },
    setIsSaveConfig(value: boolean) {
      this.IsSaveConfig = value
      setTimeout(() => {
        this.IsSaveConfig = false
      }, 5000)
    },
    setPauseTranslation() {
      this.pauseTranslation = !this.pauseTranslation
    },
    setOriginalTextVisiable(value: boolean) {
      this.originalTextVisiable = value
    }
  }
})
export { TranslatorViewStore }
