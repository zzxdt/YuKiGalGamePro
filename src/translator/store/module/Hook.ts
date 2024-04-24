import { defineStore } from "pinia";
import { TranslatorConfigStore } from "./Config";
export interface TextOutputInfo {
  formattedText?: string;
}
export interface TranMecab {
  result: string;
  mp3Url: string;
  reading: string;
  romaji: string
}
export interface TranMecabInfo {
  word: String,
  romaji: String,
  pos: String,
  baseform: String,
  kreading: String,
  reading: String,
}
export interface NameAndCode {
  name: string;
  code: string;
  pid: number;
  text: string;
  handle: number;
}

const TranslatorHookStore = defineStore('TranslatorHookState', {
  state: () => ({
    hookinfos: {} as Record<number, NameAndCode[]>,
    mecabOutputs: {} as Record<number, TextOutputInfo[]>,
    currentHandle: null as number | null,
    sendToOrginalText: '',
    MtranslationResult: {} as TranMecab,
    checkRedisExist: false,
    MtranslationMecabInfo: {} as TranMecabInfo,
    dialogIsEnabled: false,
    starred: false
  }),
  getters: {
    getStarred: (state) => {
      return state.starred
    },
    getMtranslationMecabInfo: (state) => {
      return state.MtranslationMecabInfo
    },
    getMtranslationResult: (state) => {
      return state.MtranslationResult;
    },
    getCheckRedisExist: (state) => {
      return state.checkRedisExist;
    },
    getCurrentHookInfo: (state) => {
      if (state.currentHandle != null) {
        return state.hookinfos[state.currentHandle] || [];
      }
      return [];
    },
    getCurrentMecabOutput: (state) => {
      if (state.currentHandle != null) {
        return state.mecabOutputs[state.currentHandle] || [];
      }
      return [];
    },
    getDialogIsEnabled: (state) => {
      return state.dialogIsEnabled;
    },
    getcurrentHandle: (state) => {
      return state.currentHandle;
    },
  },
  actions: {
    addText(handle: number, hookinfo: NameAndCode, mecabOutput?: TextOutputInfo) {
      this.hookinfos[handle] = [hookinfo];
      if (TranslatorConfigStore().default.mecab) {
        this.mecabOutputs[handle] = mecabOutput ? [mecabOutput] : [];
      }
    },
    setCurrentHandle(choseHandle: number) {
      this.currentHandle = choseHandle;
    },
    handleMecabText(translation: TranMecab) {
      this.MtranslationResult.result = translation.result;
      this.MtranslationResult.mp3Url = translation.mp3Url;
    },
    handleMecabTextInRedisInfo(translation: TranMecab) {
      this.MtranslationResult.result = translation.result;
      this.MtranslationResult.mp3Url = translation.mp3Url;
    },
    handleCheckMecabExist(redisExist: boolean) {
      this.checkRedisExist = redisExist;
    },
    handleMecabTranslationTextInfo(word: string, romaji: string, pos: string, baseform: string, kreading: string, reading: string) {
      this.MtranslationMecabInfo = {
        word: word,
        romaji: romaji,
        pos: pos,
        baseform: baseform,
        kreading: kreading,
        reading: reading
      }
    },
    setDialog(value: boolean) {
      this.dialogIsEnabled = value
    },
    setStarred(value: boolean) {
      this.starred = value
    },
    async translateMecabText(wordKey: string, word: string, reading: string, romaji: string, saveInAnki: string) {
      await window.mainApi.translateMecabText(wordKey, word, reading, romaji, saveInAnki)
    },
    async getRedisMecabInfo(wordKey: string) {
      await window.mainApi.getRedisMecabInfo(wordKey)
    },
    async checkWordInRedis(wordKey: string) {
      await window.mainApi.checkWordInRedis(wordKey)
    },
    async sendWordToAnki(original: string, reading: string, translation: string, audioURL: string) {
      await window.mainApi.sendWordToAnki(original, reading, translation, audioURL)
    },
    async checkWordInAnki(original: string) {
      await window.mainApi.checkWordInAnki(original)
    },
    async removeWordFromAnki(original: string) {
      await window.mainApi.removeWordFromAnki(original)
    },
    //是否收藏，存放在anki中
    async toggleStar(original: string, reading: string, translation: string, audioURL: string) {
      if (this.starred) {
        // 如果已收藏，执行移除操作
        await this.removeWordFromAnki(original);
      } else {
        // 如果未收藏，执行添加操作
        await this.sendWordToAnki(original, reading, translation, audioURL);
      }
      this.starred = !this.starred;
    }
  }
})
export { TranslatorHookStore } 
