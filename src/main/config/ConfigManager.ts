interface INameToConfigMap {
  [configName: string]: Config
}
import Config from './Config'
import DefaultConfig from './DefaultConfig'
import GamesConfig from './GamesConfig'
import GuiConfig from './GuiConfig'
import TextsConfig from './TextsConfig'
const debug = require('debug')('yuki:configManager')

export default class ConfigManager {
  public static getInstance(): ConfigManager {
    if (!this.instance) {
      this.instance = new ConfigManager()
    }
    return this.instance
  }
  public nameToConfigMap: Map<string, any>
  // 实例化四个配置文件
  constructor() {
    this.nameToConfigMap = new Map<string, any>()
    this.nameToConfigMap.set('default', new DefaultConfig())
    this.nameToConfigMap.set('games', new GamesConfig())
    this.nameToConfigMap.set('texts', new TextsConfig())
    this.nameToConfigMap.set('gui', new GuiConfig())
  }
  private static instance: ConfigManager | undefined
  // 传入字符串，得到配置文件的实例
  public get<T extends yuki.Config.Config>(configName: string): T {
    try {
      return this.nameToConfigMap.get(configName).get()
    } catch (e) {
      debug('get new object', configName)
      return this.nameToConfigMap.get('default').get()
    }
  }
  public set<T extends yuki.Config.Config>(configName: string, cfg: T): Promise<void> {
    let setResult: any
    try {
      setResult = this.nameToConfigMap.get(configName).set(cfg)
    } catch (e) {
      debug('set config named %s', configName)
    }
    return setResult
  }

  public async save(configName: string): Promise<void> {
    let result: any
    try {
      result = await this.nameToConfigMap.get(configName).save()
    } catch (e) {
      debug('save config named %s', configName)
    }
    return result
  }

  public getFilename(configName: string): string {
    try {
      return this.nameToConfigMap.get(configName).getFilename()
    } catch (e) {
      debug('get file named is %s', configName)
      return 'default'
    }
  }
}
