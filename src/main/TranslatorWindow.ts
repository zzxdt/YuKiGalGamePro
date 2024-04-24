import { BrowserWindow } from 'electron'
import BaseGame from './BaseGame'
import Constants from './utils/Constants'
import ConfigManager from './config/ConfigManager'
import IPCs from './IPCs'
import Hooker from './Hooker'
import IpcTypes from '@/common/IpcTypes'
import { debounce } from 'lodash'
import { logger } from './Log/LogCollector'
export default class TranslatorWindow {
  private TranslatorWindow!: Electron.BrowserWindow
  private game!: BaseGame
  private isRealClose = false
  private config!: yuki.Config.Gui['translatorWindow']

  constructor() {
    this.create()
  }

  public getWindow() {
    return this.TranslatorWindow
  }

  public close() {
    this.isRealClose = true
    this.unsubscribeHookerEvents()
    this.TranslatorWindow.close()
  }

  public setGame(game: BaseGame) {
    this.game = game
  }

  public getGameInfo(): yuki.Game {
    return this.game.getInfo()
  }

  private create() {
    this.config = ConfigManager.getInstance().get<yuki.Config.Gui>('gui').translatorWindow
    this.TranslatorWindow = new BrowserWindow({
      webPreferences: {
        defaultFontFamily: {
          standard: 'Microsoft Yahei UI',
          serif: 'Microsoft Yahei UI',
          sansSerif: 'Microsoft Yahei UI',
        },
        ...Constants.DEFAULT_WEB_PREFERENCES
      },
      // 设置透明度
      transparent: true,
      show: false,
      frame: false,
      resizable: true
    })
    // 初始化后打开 开发工具
    // this.TranslatorWindow.webContents.on('did-frame-finish-load', (): void => {
    //   if (Constants.APP_TRANSLATOR_URL_DEV) {
    //     this.TranslatorWindow.webContents.openDevTools()
    //   }
    // })
    this.TranslatorWindow.on('ready-to-show', () => {
      // choose translucent as default, unless assigning transparent explicitly
      this.TranslatorWindow.focus()
      logger.debug('subscribing hooker events...')
      this.subscribeHookerEvents()
      logger.debug('hooker events subscribed')
      this.TranslatorWindow.show()
      this.TranslatorWindow.setAlwaysOnTop(true)
    })
    //发送config只 pinia
    this.TranslatorWindow.webContents.on('did-finish-load', () => {
      const configData = ConfigManager.getInstance().get('default')
      this.config.bounds = this.config.sizes['/hook']
      this.TranslatorWindow.webContents.send(IpcTypes.HAS_CONFIG, 'gui', this.config)
      this.TranslatorWindow.webContents.send(IpcTypes.HAS_CONFIG, 'default', configData)
    })
    // 初始化事件
    IPCs.initializeTranslatorWindow(this.TranslatorWindow)
    //监视窗口
    this.TranslatorWindow.on('resize', debounce(() => {
      let { width, height } = this.TranslatorWindow.getBounds()
      this.TranslatorWindow.webContents.send(IpcTypes.WINDOWS_RESIZE, { width, height })
    }, 300))
    //退出保存
    this.TranslatorWindow.on('close', (event) => {
      if (!this.isRealClose) {
        event.preventDefault()
        this.TranslatorWindow.hide()
      }
      logger.debug('saving translator window bounds -> %o', this.TranslatorWindow.getBounds())
      logger.debug('saving translator window alwaysOnTop -> %s', this.TranslatorWindow.isAlwaysOnTop())
      ConfigManager.getInstance().set<yuki.Config.Gui>('gui', {
        ...ConfigManager.getInstance().get('gui'),
        translatorWindow: {
          ...ConfigManager.getInstance().get<yuki.Config.Gui>('gui').translatorWindow,
          bounds: this.TranslatorWindow.getBounds(),
        }
      })
    })
    this.TranslatorWindow.setBounds(
      this.config.bounds
    )
    if (Constants.IS_DEV_ENV) {
      this.TranslatorWindow.loadURL(Constants.APP_TRANSLATOR_URL_DEV)
    } else {
      this.TranslatorWindow.loadFile(Constants.APP_TRANSLATOR_URL_PROD)
    }
    return this.TranslatorWindow
  }
  // 订阅hooker事件
  private subscribeHookerEvents() {
    Hooker.getInstance().subscribe('thread-output', this.TranslatorWindow.webContents)
  }

  private unsubscribeHookerEvents() {
    Hooker.getInstance().unsubscribe('thread-output', this.TranslatorWindow.webContents)
  }
}
