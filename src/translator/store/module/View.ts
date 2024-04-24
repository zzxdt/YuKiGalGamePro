import { defineStore } from "pinia";
const TranslatorViewStore = defineStore('TranslatorViewState', {
  state: () => ({
    isAlwaysOnTop: true,
    pauseNewText: false,
    showNavigation: false,
    pauseTranslation: false,
    IsSaveConfig: false
  }),
  getters: {
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
      this.showNavigation = value;
    },
    setPauseNewText(value: boolean) {
      this.pauseNewText = value;
    },
    setIsAlwaysOnTop(value: boolean) {
      this.isAlwaysOnTop = value
    },
    setIsSaveConfig(value: boolean) {
      this.IsSaveConfig = value
    },
    setPauseTranslation() {
      this.pauseTranslation = !this.pauseTranslation
    }
  }
});
export { TranslatorViewStore }
