import { defineStore } from 'pinia';
interface RedisWord {
  key: string;
  value: Record<string, string>;
}
export interface ApiResponse {
  success: boolean;
  error?: string;
}
const redisStore = defineStore('redisStore', {
  state: () => ({
    wordInfo: [] as RedisWord[],
    hasDeleteAllwordInRedis: {} as ApiResponse,
    hasGetAllWordInRedis: false,
    redisIsStart: true
  }),
  getters: {
    getRedisStart: (state) => {
      return state.redisIsStart
    },
    getHasDeleteAllwordInRedis: (state) => {
      return state.hasDeleteAllwordInRedis
    },
    getHasGetAllWordInRedis: (state) => {
      return state.hasGetAllWordInRedis
    },
    getWordInfo: (state) => {
      return state.wordInfo
    }
  },
  actions: {
    loadAllWordInfo() {
      window.mainApi.checkAllWordInRedis()
    },
    //考虑到性能问题，暂时不考虑
    checkAllInAnki() {
      this.wordInfo.forEach(word => {
        window.mainApi.checkWordInAnki(word.value.original)
      })
    },
    deleteAllWordInRedis() {
      window.mainApi.deleteAllWordInRedis()
    },
    quitRedis() {
      window.mainApi.quitRedis()
    },
    setWordInfo(items: RedisWord[]) {
      this.wordInfo = items
    },
    setDeleteAllWordInRedis(value: ApiResponse) {
      this.hasDeleteAllwordInRedis = value
    },
    setGetAllWordInRedis(value: boolean) {
      this.hasGetAllWordInRedis = value
    },
    setRedisStart(value: boolean) {
      this.redisIsStart = value
    }
  }
});
export { redisStore }