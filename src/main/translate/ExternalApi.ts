import crypto from 'crypto'
import fs from 'fs'
import { resolve } from 'path'
import axios from 'axios'
import vm from 'vm'
import Constants from '../utils/Constants'
const debug = require('debug')('yuki:api')
export default class ExternalApi implements yuki.Translator {
  private config: yuki.Config.OnlineApiItem
  private name: string
  private scriptString: string = ''
  private relativePath: string = ''
  private transalteCounter: number
  private responseVmContext!: vm.Context
  constructor(config: yuki.Config.OnlineApiItem) {
    this.config = config
    this.name = config.name
    this.transalteCounter = 0
    debug('has EnternalApi object! ')
    if (!this.config.jsFile) {
      debug('[%s] config not contains enough information. ignore', this.config.name)
      throw new TypeError()
    }
    // 读取api文件
    this.loadExternalJsFile()
    this.registerWatchCallback()
  }

  public isEnable() {
    return this.config.enable
  }

  public setEnable(isEnable: boolean) {
    this.config.enable = isEnable
  }

  public getName() {
    return this.name
  }
  public getConfig() {
    return this.config
  }
  private loadExternalJsFile() {
    if (!this.config.jsFile) {
      return
    }
    this.relativePath = resolve(__dirname, this.config.jsFile)
    try {
      this.scriptString = fs.readFileSync(this.relativePath, 'utf8')
      debug('external file %s loaded', this.relativePath)
    } catch (error) {
      debug('load external file has error!', error)
      throw error
    }
  }
  public async translate(text: string) {
    debug('the counter of translator has been use and the counter is:', this.transalteCounter++)
    this.responseVmContext = await this.createVmContext()
    this.responseVmContext.text = text
    try {
      debug('Externaltext:', text)
      await vm.runInContext(this.scriptString, this.responseVmContext, { displayErrors: true })
      if (this.responseVmContext.result) {
        return {
          result: this.responseVmContext.result,
          mp3Url: this.responseVmContext.mp3Url ? this.responseVmContext.mp3Url : ''
        }
      } else {
        throw Error('翻译失败')
      }
    } catch (error) {
      throw Error('excute translation Javascript error')
    }
  }
  // 创建沙箱环境
  private async createVmContext() {
    const vmContent = {
      axios: axios,
      crypto: crypto,
      text: '',
      result: '',
      console: console,
      require: require,
      mp3Url: ''
    }
    vm.createContext(vmContent)
    return vmContent
  }
  private registerWatchCallback() {
    fs.watch(this.relativePath, {}, () => {
      debug('[%s] script file changed. reloading...', this.config.name)
      this.loadExternalJsFile()
      this.createVmContext()
    })
  }
}
