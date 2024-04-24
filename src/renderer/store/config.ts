import { defineStore } from 'pinia'
import { guiStore } from './gui';
import { YkAboutPage } from '../components/layout';
import { stat } from 'original-fs';
const configStore = defineStore('configState', {
  state: () => ({
    default: {} as yuki.ConfigState['default'],
    games: [] as yuki.ConfigState['games'],
    texts: {} as yuki.ConfigState['texts'],
    game: {
      name: '',
      path: '',
      localeChanger: '',
      code: ''
    } as yuki.Game,
  }),
  getters: {
    isGameInfoEmpty: (state) => {
      return !state.game.name || !state.game.path;
    },
    localeChangerArray(state) {
      return Object.values(state.default.localeChangers);
    },
    getGameName: (state) => {
      return state.game.name
    },
    getGamePath: (state) => {
      return state.game.path
    },
    getGameCode: (state) => {
      return state.game.code
    },
    getGameLocaleChanger: (state) => {
      return state.game.localeChanger
    },
    getGame: (state) => {
      return state.game
    },
    getGames: (state) => {
      return state.games
    },
    getOnlineApis: (state) => {
      return state.default.onlineApis
    },
    getLocalChangers: (state) => {
      return state.default.localeChangers
    },
    getTranslationTextName: (state) => {
      return state.default.textTranslationApi
    },
    getMecabTextName: (state) => {
      return state.default.mecabTranslationApi
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
          this.default = payload.cfgs;
          break;
        case 'games':
          if (Array.isArray(payload.cfgs)) {
            this.games = payload.cfgs;
            const useGuiStore = guiStore()
            this.games.length === 0 ? useGuiStore.setNoGame(true) : useGuiStore.setNoGame
          }
        case 'texts':
          this.texts = payload.cfgs;
          break;
        default:
          console.log('invalid config name: %s', JSON.stringify(payload.name), 'config is:', JSON.stringify(payload.cfgs));
          break;
      }
    },
    clearGames() {
      this.games = []
    },
    //管理各个api开关
    toggleApiEnable(index: number, isEnabled: boolean) {
      const targetApi = this.default.onlineApis[index];
      targetApi.enable = isEnabled;
      targetApi.selectSwitchDisable = !isEnabled;
      if (targetApi && isEnabled) {
        this.default.onlineApis.forEach((api, idx) => {
          if (api.apiType === targetApi.apiType && idx !== index) {
            api.enable = false;
            api.selectSwitchDisable = true
          }
        })
      }
    },
    setTranslationTextName(name: string) {
      this.default.textTranslationApi = name
    },
    setMecabTextName(name: string) {
      this.default.mecabTranslationApi = name
    },
    initializeSelectSwitches() {
      this.default.onlineApis.forEach(api => {
        api.selectSwitchDisable = !api.enable
      })
    },
    saveConfig() {
      const mdefault = this.default
      window.mainApi.requestSaveConfig('default', JSON.stringify(mdefault))
    },
    setGamePath(path: string) {
      this.game.path = path;
      this.game.name = path.substring(path.lastIndexOf('\\') + 1, path.lastIndexOf('.exe'));
    },
    setGameCode(code: string) {
      this.game.code = code
    },
    setGameLocalChanger(localeChanger: string) {
      this.game.localeChanger = localeChanger
    },
    setLocalChanger(localeChanger: yuki.Config.LocaleChangerItems) {
      this.default.localeChangers = localeChanger
    },
    addLocaleChanger(newName: string, exec: string, enable: boolean) {
      if (!this.default.localeChangers.hasOwnProperty(newName)) {
        this.default.localeChangers[newName] = { name: newName, enable, exec };
      } else {
        console.error("LocaleChanger with this name already exists!");
      }
    },
    editLocaleChanger(name:string, newData:any) {
      if (this.default.localeChangers[name]) {
        this.default.localeChangers[name] = { ...this.default.localeChangers[name], ...newData };
      }
    },
    deleteLocaleChanger(name: string) {
      if (this.default.localeChangers[name]) {
        delete this.default.localeChangers[name];
      }
    },
    resetGame() {
      this.game = { name: '', path: '', code: '', localeChanger: '' };
    }
  }
})

export { configStore }
