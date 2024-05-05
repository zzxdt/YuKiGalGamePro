import ExternalApi from './ExternalApi'
import ConfigManager from '../config/ConfigManager'
const debug = require('debug')('app:TranslationManager')
export default class TranslationManager {
  private lastText = ''
  private lastResult = ''
  public static getInstance(): TranslationManager {
    if (!this.instance) {
      this.instance = new TranslationManager()
    }
    return this.instance
  }
  private static instance: TranslationManager | undefined
  private apis: Map<string, ExternalApi[]> = new Map()
  private configs: Array<yuki.Config.OnlineApiItem> = []
  constructor() {
    this.configs = ConfigManager.getInstance().get<yuki.Config.Default>('default').onlineApis
    this.initializeApis(this.configs)
  }
  public initializeApis(apisConfig: yuki.Config.OnlineApiItem[]): void {
    apisConfig.forEach((config) => {
      if (config.enable && config.apiType) {
        if (!this.apis.has(config.apiType)) {
          this.apis.set(config.apiType, [])
        }
        const apiInstance = new ExternalApi(config)
        this.apis.get(config.apiType)?.push(apiInstance)
      }
    })
  }
  public async translateText(text: string, apiType: 'textTranslation' | 'mecabTranslation') {
    const apis = this.apis.get(apiType)
    if (!apis || apis.length === 0) {
      throw new Error('No available api!')
    }
    try {
      if (text === this.lastText) {
        debug('same text skim it!')
        return this.lastResult
      }
      this.lastText = text
      const translationResult = await apis[0].translate(text)
      this.lastResult = translationResult.result
      debug('textTranslationManagerLastResult：', this.lastResult)
      return translationResult
    } catch (error) {
      debug('Translation failed.', error)
    }
  }
}
