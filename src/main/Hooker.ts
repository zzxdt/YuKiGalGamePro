import IpcTypes from '../common/IpcTypes'
import { logger } from './Log/LogCollector'
import * as path from 'path'
import { Textractor } from 'textractor-wrapper'
import ApplicationBuilder from '../common/ApplicationBuilder'
import ConfigManager from './config/ConfigManager'
import FilterMiddleware from './middlewares/FilterMiddleware'
import MecabMiddleware from './middlewares/MeCabMiddleware'
import PublishMiddleware from './middlewares/PublishMiddleware'
import TextInterceptorMiddleware from './middlewares/TextInterceptorMiddleware'
import TextMergerMiddleware from './middlewares/TextMergerMiddleware'
import TextModifierMiddleware from './middlewares/TextModifierMiddleware'

let applicationBuilder: ApplicationBuilder<yuki.TextOutputObject>

interface IPublisherMap {
  ['thread-output']: PublishMiddleware
}

export default class Hooker {
  public static getInstance() {
    if (!this.instance) {
      this.instance = new Hooker()
    }
    return this.instance
  }
  private static instance: Hooker | undefined

  private hooker: Textractor

  private publisherMap: IPublisherMap = {
    'thread-output': new PublishMiddleware(IpcTypes.HAS_HOOK_TEXT)
  }

  private constructor() {
    // TextractorCLI路径
    const absolutePath = path.resolve(__dirname, '../../lib/textractor/TextractorCLI.exe')
    logger.debug('trying to access CLI exe at %s', absolutePath)
    this.hooker = new Textractor(absolutePath)
    this.buildApplication()
    this.initHookerCallbacks()
    this.hooker.start()
  }
  // 缓存引用mecab-lite
  public rebuild() {
    delete require.cache[require.resolve('mecab-lite')]
    this.buildApplication()
  }
  public subscribe(on: keyof IPublisherMap, webContents: Electron.WebContents) {
    if (!this.publisherMap[on]) {
      logger.debug('trying to register unknown event %s', on)
    } else {
      this.publisherMap[on].subscribe(webContents)
    }
  }

  public unsubscribe(on: string, webContents: Electron.WebContents) {
    if (!this.publisherMap[on]) {
      logger.debug('trying to unregister unknown event %s', on)
    } else {
      this.publisherMap[on].unsubscribe(webContents)
    }
  }
  // 注入进程
  public injectProcess(pid: number) {
    logger.debug('injecting process %d...', pid)
    this.hooker.attach(pid)
    logger.debug('process %d injected', pid)
  }
  public insertHook(pid: number, code: string) {
    logger.debug('inserting hook %s to process %d...', code, pid)
    this.hooker.hook(pid, code)
    logger.debug(`hook %s inserted into process %d`, code, pid)
  }
  private buildApplication() {
    applicationBuilder = new ApplicationBuilder<yuki.TextOutputObject>()
    // 添加中间件组件，可以直接再.json文件中配置
    applicationBuilder.use(
      new TextMergerMiddleware(ConfigManager.getInstance().get<yuki.Config.Texts>('texts').merger)
    )
    applicationBuilder.use(
      new TextInterceptorMiddleware(
        ConfigManager.getInstance().get<yuki.Config.Texts>('texts').interceptor
      )
    )
    applicationBuilder.use(
      new TextModifierMiddleware(
        ConfigManager.getInstance().get<yuki.Config.Texts>('texts').modifier
      )
    )
    applicationBuilder.use(
      new MecabMiddleware(ConfigManager.getInstance().get<yuki.Config.Default>('default').mecab)
    )
    applicationBuilder.use(new FilterMiddleware())
    applicationBuilder.use(this.publisherMap['thread-output'])
    logger.debug('application builded')
  }

  private initHookerCallbacks() {
    try {
      this.hooker.on('output', async (output) => {
        await applicationBuilder.run(output)
      })
    }
    catch (e) {
      logger.error("Textractor has issue!", e)
    }
  }
}
