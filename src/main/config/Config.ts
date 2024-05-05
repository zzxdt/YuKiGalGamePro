import { ipcMain } from 'electron'
import fs from 'fs'
import { resolve } from 'path'
import * as jsonfile from 'jsonfile'
import { app } from 'electron'
import IpcTypes from '../../common/IpcTypes'
import Constants from '@/main/utils/Constants'
const debug = require('debug')('yuki:config')

abstract class Config {
  private static readonly FILE_OPTIONS = {
    EOL: '\r\n',
    spaces: 2
  }
  protected config: any
  protected filePath!: string
  protected isSaving: boolean = false
  constructor() {
    // 因为使用的是vite所以，文件路径是在下dist目录下
    this.filePath = Constants.IS_DEV_ENV
      ? resolve(__dirname, `../../config/${this.getFilename()}.json`)
      : resolve(__dirname, `../../../config/${this.getFilename()}.json`)
    this.asyncInit()
  }
  async asyncInit() {
    await this.load()
    await this.save()
    debug('%s loaded with pre-save', this.filePath)
    this.registerWatchCallback()
  }

  async load() {
    let fileContent: any
    try {
      // 获取games.json文件的内容
      fileContent = await jsonfile.readFile(this.filePath)
      this.config = {
        ...this.getDefaultObject(),
        ...fileContent
      }
      debug('%s load file success!> %s', this.filePath)
    } catch (e) {
      debug('%s loads file failed !> %s', this.filePath, e)
      this.config = this.getDefaultObject()
    }
    // getDefaultObject()是多个配置文件的默认对象,每个Config都有自己的getDefaultObject()
    // 详见config目录下的文件
  }
  //书写json文件
  async save() {
    try {
      await jsonfile.writeFile(this.filePath, this.config, Config.FILE_OPTIONS)
      debug('%s file saved sucess', this.filePath)
    } catch (e) {
      debug('%s file saves failed !> %s', this.filePath, e)
    }
  }
  // config/getDefaultObject()返回的对象
  public get() {
    debug('%s file get config!')
    return this.config
  }

  public async set(cfg: yuki.Config.Default) {
    this.config = cfg
    debug('%s reset file:', cfg)
    await this.save()
  }

  public abstract getFilename(): string

  protected abstract getDefaultObject(): object

  private registerWatchCallback() {
    fs.watch(this.filePath, {}, () => {
      if (this.isSaving) return
      try {
        debug('%s changed. reloading...', this.getFilename())
        this.load()
        ipcMain.emit(IpcTypes.RELOAD_CONFIG, this.getFilename())
      } catch (e) {
        return
      }
    })
  }
}

export default Config
