import { ipcMain, shell, IpcMainEvent, BrowserWindow, app, dialog } from 'electron'
import Constants from './utils/Constants'
import IpcTypes from '@/common/IpcTypes'
import { logger } from './Log/LogCollector'
import BaseGame from './BaseGame'
import ConfigManager from './config/ConfigManager'
import Game from './Game'
import GameFromProcess from './GameFromProcess'
import Hooker from './Hooker'
import Processes from './Processes'
import TranslatorWindow from './TranslatorWindow'
import TranslationManager from './translate/TranslationManager'
import StoreInRedis from './translate/storeInRedis'
import AnkiManager from './ankiToolManager/ankiManager'
/*
 * IPC Communications
 * */
//返回结果的类型用来响应 sncakbar组件
let runningGame: BaseGame
let translatorWindow: TranslatorWindow | null
export default class IPCs {
  static initialize(mainWindow: BrowserWindow): void {

    // Get application version
    ipcMain.on('msgRequestGetVersion', (event: IpcMainEvent) => {
      event.returnValue = Constants.APP_VERSION
    })

    // Open url via web browser
    ipcMain.on('msgOpenExternalLink', async (event: IpcMainEvent, url: string) => {
      await shell.openExternal(url)
    })
    //监视redis是否开启
    ipcMain.on(IpcTypes.REDIS_STATUS, (event: IpcMainEvent, status: boolean) => {
      console.log("redis状态:", status)
      event.sender.send(IpcTypes.CURRENT_REDIS_STATUS, status)
    })
    //显示主窗口
    ipcMain.on(IpcTypes.SHOW_MAINWINDOWS, (event: IpcMainEvent) => {
      if (!mainWindow.isDestroyed()) {
        mainWindow.show()
      }
    })
    ipcMain.on(IpcTypes.RESTART_APP, (event: IpcMainEvent) => {
      app.relaunch()
      app.exit(0);
    })
    // ipcMain主进程对应index.ts
    ipcMain.on(IpcTypes.MINISIZE_APP, () => {
      const focusedWindow = BrowserWindow.getFocusedWindow()
      if (focusedWindow) {
        focusedWindow.minimize()
      }
    })
    //添加localchanger
    ipcMain.on(IpcTypes.REQUEST_PATH_WITH_FILE, async (event: IpcMainEvent) => {
      try {
        const { filePaths } = await dialog.showOpenDialog({
          title: `请选择文件夹下的.exe文件`,
          properties: ['openFile'],
          filters: [{ name: '可执行文件', extensions: ['exe'] }]
        })
        if (filePaths && filePaths.length > 0) {
          event.reply(IpcTypes.HAS_PATH_WITH_FILE, filePaths[0])
        }
      } catch (e) {
        logger.error("get path with file failure!", e)
      }
    })
    ipcMain.on(IpcTypes.CLOSE_APP, () => {
      app.quit()
    })
    //改变窗口大小
    ipcMain.on(IpcTypes.RESIZE_WINDOWS, (event: IpcMainEvent, x: number, y: number) => {
      const win = BrowserWindow.getFocusedWindow()
      if (win) {
        win.setSize(x, y)
      }
    })
    // translator下添加特殊码 no
    ipcMain.on(
      IpcTypes.REQUEST_INSERT_HOOK,
      (event: Electron.IpcMainEvent, code: string) => {
        if (code !== '') {
          runningGame.getPids().map((pid) => {
            Hooker.getInstance().insertHook(pid, code)
          })
        }
      }
    )
    // 请求进程
    ipcMain.on(IpcTypes.REQUEST_PROCESSES, async (event: IpcMainEvent) => {
      try {
        // 返回一个proceess[]数组
        const processes = await Processes.get()
        event.reply(IpcTypes.HAS_PROCESSES, processes)
      } catch {
        event.reply(IpcTypes.HAS_PROCESSES, [])
      }
    })
    // 处理进程
    ipcMain.on(
      IpcTypes.REQUEST_RUN_GAME,
      (event: IpcMainEvent, game?: yuki.Game, process?: yuki.Process) => {
        if (game) {
          runningGame = new Game(game);
        } else if (process) {
          runningGame = new GameFromProcess(process);
        } else {
          return;
        }
        // 设置游戏状态改变时的处理逻辑
        runningGame.on('started', handleGameStarted);
        runningGame.on('exited', handleGameExited);
        runningGame.on('abort', handleGameAborted);
        // 启动游戏
        runningGame.start();
      }
    )
    ipcMain.on(IpcTypes.OPEN_FLODER, (event: IpcMainEvent, path) => {
      shell.showItemInFolder(path)
    })
    // 打开网页的devTool工具
    ipcMain.on(IpcTypes.TOOGLE_DEV_TOOLS, (event: IpcMainEvent) => {
      const webContents = BrowserWindow.getFocusedWindow()?.webContents
      if (webContents) {
        webContents.toggleDevTools()
      }
    })
    // 使用electron.opendialog方法打开文件夹,确认路径
    ipcMain.on(IpcTypes.REQUEST_NEW_GAME_PATH, async (event: Electron.IpcMainEvent) => {
      const { filePaths } = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: '可执行文件', extensions: ['exe'] }]
      });
      if (filePaths.length > 0) {
        event.reply(IpcTypes.HAS_NEW_GAME_PATH, filePaths[0]);
      }
    })
    //更新config
    ipcMain.on(IpcTypes.RELOAD_CONFIG, (event: IpcMainEvent, name: string) => {
      const configName = ConfigManager.getInstance().getFilename(name)
      logger.debug('reloading config %s', configName)
      mainWindow.webContents.send(
        IpcTypes.HAS_CONFIG,
        configName,
        ConfigManager.getInstance().get(configName)
      )
    })
    //请求储存GuiConfig
    ipcMain.on(IpcTypes.REQUEST_SAVE_TRANSLATOR_GUI, (event: IpcMainEvent, cfg: any) => {
      logger.debug('request saving translator gui config...')
      ConfigManager.getInstance().set<yuki.Config.Gui>(
        'gui', {
        ...ConfigManager.getInstance().get('gui'),
        translatorWindow: cfg
      })
      logger.debug('translator gui config saved')
    })
    //请求储存DefaultConfig 
    ipcMain.on(IpcTypes.REQUEST_SAVE_CONFIG, (event: IpcMainEvent, name: string, cfgs: any) => {
      const data = JSON.parse(cfgs)
      const configFileName = ConfigManager.getInstance().getFilename(name)
      logger.debug(`request saving config %s...`, configFileName)
      ConfigManager.getInstance().set(name, data)
      Hooker.getInstance().rebuild()
      logger.debug('resend config %s to window', configFileName)
      sendConfig(name, event)
    })
    // 移除游戏
    ipcMain.on(IpcTypes.REQUEST_REMOVE_GAME, async (event: IpcMainEvent, game: yuki.Game) => {
      try {
        const games = ConfigManager.getInstance().get<yuki.Config.Games>('games')
        ConfigManager.getInstance().set<yuki.Config.Games>('games', games.filter((item: yuki.Game) => item.name !== game.name))
        await sendConfig('games', event)
      }
      catch (e) {
        logger.error("remove game failure!", e)
      }
    })
    //debug信息
    ipcMain.on(IpcTypes.SEND_DEBUG_MESSAGE, (event: IpcMainEvent, { level, message, meta }) => {
      event.reply(IpcTypes.HAS_NEW_DEBUG_MESSAGE, { level, message, meta })
    })
    // 添加游戏
    ipcMain.on(
      IpcTypes.REQUEST_ADD_GAME,
      async (event: Electron.IpcMainEvent, newGame: yuki.Game) => {
        try {
          const games = ConfigManager.getInstance().get<yuki.Config.Games>('games')
          // 检查是否存在相同路径的游戏
          const gameExists = games.some(game => game.path === newGame.path);
          if (!gameExists) {
            logger.debug("has no same games!")
            games.push(newGame);
            logger.debug("add a new game")
            await ConfigManager.getInstance().save('games');
            // 发送成功添加的消息
            event.reply(IpcTypes.HAS_ADDED_GAME, newGame);
            await sendConfig('games', event)
          } else {
            // 如果游戏已存在，发送游戏已存在的消息
            event.reply(IpcTypes.GAME_ALREADY_EXISTS, newGame);
          }
        } catch (e) {
          logger.error("add game card failure!", e)
        }
        // 返回'games' 和'games:[]'  
      }
    )
    //设置redis的具体函数
    ipcMain.on(IpcTypes.DELETE_ALL_WORD_IN_REDIS, async (event: IpcMainEvent) => {
      try {
        const deleteAllWordInfo = StoreInRedis.getInstance().deleteAllWordInfo()
        event.sender.send(IpcTypes.HAS_DELETE_ALL_FROM_REDIS, deleteAllWordInfo)
      } catch (error) {
        logger.error("delete all data in redis failure!")
      }
    })
    ipcMain.on(IpcTypes.CHECK_ALL_WORD_IN_REDIS, async (event: IpcMainEvent) => {
      try {
        const result = await StoreInRedis.getInstance().checkAllWordInfo()
        event.sender.send(IpcTypes.HAS_ALL_WORD_FROM_REDIS, result)
      } catch (error) {
        logger.error("check all data in redis failure!")
      }
    })
    ipcMain.on(IpcTypes.QUIT_REDIS, (event: IpcMainEvent) => {
      StoreInRedis.getInstance().quit()
    })
    ipcMain.on(IpcTypes.LOAD_GAME_AT_START, async (event: IpcMainEvent, configName: string) => {
      await sendConfig(configName, event)
    })
    // 返回对应的类型
    async function sendConfig(configName: string, event: Electron.IpcMainEvent) {
      const configData = ConfigManager.getInstance().get(configName)
      event.reply(
        IpcTypes.HAS_CONFIG,
        configName,
        configData
      );
    }
    // 主窗口和翻译窗口管理函数
    function closeTranslatorWindow() {
      if (translatorWindow) {
        translatorWindow.close();
        translatorWindow = null;
      }
    }
    function handleGameStarted() {
      mainWindow.hide();
      mainWindow.webContents.send(IpcTypes.HAS_RUNNING_GAME);
      closeTranslatorWindow();
      translatorWindow = new TranslatorWindow();
      translatorWindow.setGame(runningGame);
    }

    function handleGameExited() {
      closeTranslatorWindow();
      mainWindow.show();
    }

    function handleGameAborted() {
      mainWindow.webContents.send(IpcTypes.GAME_ABORTED);
    }
  }


  //初始化，translatorWindows窗口
  static initializeTranslatorWindow(transltorWindow: BrowserWindow): void {
    //隐藏翻译窗口
    ipcMain.on(IpcTypes.HIDE_TRANSLATEWINDOWS, (event: IpcMainEvent) => {
      const focusedWindow = BrowserWindow.getFocusedWindow()
      if (focusedWindow) {
        focusedWindow.close()
        ipcMain.emit(IpcTypes.SHOW_MAINWINDOWS)
      }
    })
    //debug信息
    ipcMain.on(IpcTypes.SEND_DEBUG_MESSAGE, (event: IpcMainEvent, { level, message, meta }) => {
      event.sender.send(IpcTypes.HAS_NEW_DEBUG_MESSAGE, { level, message, meta })
    })
    //改变窗口大小
    ipcMain.on(IpcTypes.RESIZE_WINDOWS, (event: IpcMainEvent, x: number, y: number) => {
      const win = BrowserWindow.getFocusedWindow()
      if (win) {
        win.setSize(x, y)
      }
    })
    //打开anki进行传输数据
    ipcMain.on(IpcTypes.SEND_TO_ANKI, async (event: IpcMainEvent, original: string, reading: string, translation: string, audioURL: string) => {
      try {
        const saveInanki = await AnkiManager.getInstance().addInAnki(original, reading, translation, audioURL)
        event.sender.send(IpcTypes.HAS_ANKI, saveInanki)
      } catch (error) {
        logger.error('send to anki failure', error)
      }
    })
    //检查anki中是否存在
    ipcMain.on(IpcTypes.CHECK_WORD_IN_ANKI, async (event: IpcMainEvent, original: string) => {
      try {
        const hasWordInAnki = await AnkiManager.getInstance().checkInAnki(original);
        event.sender.send(IpcTypes.HAS_WORD_IN_ANKI, hasWordInAnki);
      } catch (error) {
        logger.error("An error occurred:", error);
      }
    })
    //移除anki中的单词
    ipcMain.on(IpcTypes.REMOVE_WORD_FROM_ANKI, async (event: IpcMainEvent, original: string) => {
      const removeWord = await AnkiManager.getInstance().removeWordFromAnki(original);
      event.sender.send(IpcTypes.HAS_REMOVE_WORD_FROM_ANKI, removeWord);
    })
    // 打开网页的devTool工具
    ipcMain.on(IpcTypes.TOOGLE_DEV_TOOLS, (event) => {
      const webContents = BrowserWindow.getFocusedWindow()?.webContents
      if (webContents) {
        webContents.toggleDevTools()
      }
    })
    //更新config
    ipcMain.on(IpcTypes.RELOAD_CONFIG, (event: IpcMainEvent, name: string) => {
      const configName = ConfigManager.getInstance().getFilename(name)
      logger.debug('reloading config %s', configName)
      transltorWindow.webContents.send(
        IpcTypes.HAS_CONFIG,
        configName,
        ConfigManager.getInstance().get(configName)
      )
    })
    //初始化仓库 translator default和gui
    ipcMain.on(IpcTypes.LOAD_GAME_AT_START, async (event: IpcMainEvent, configName: string) => {
      await sendConfig(configName, event)
    })
    //请求储存GuiConfig
    ipcMain.on(IpcTypes.REQUEST_SAVE_TRANSLATOR_GUI, (event: IpcMainEvent, cfg: any) => {
      logger.debug('request saving translator gui config...')
      ConfigManager.getInstance().set<yuki.Config.Gui>(
        'gui', {
        ...ConfigManager.getInstance().get('gui'),
        translatorWindow: cfg
      })
      logger.debug('translator gui config saved')
    })
    //请求储存DefaultConfig 
    ipcMain.on(IpcTypes.REQUEST_SAVE_CONFIG, (event: IpcMainEvent, name: string, cfgs: any) => {
      const data = JSON.parse(cfgs)
      const configFileName = ConfigManager.getInstance().getFilename(name)
      logger.debug(`request saving config %s...`, configFileName)
      ConfigManager.getInstance().set(name, data)
      Hooker.getInstance().rebuild()
      logger.debug('resend config %s to window', configFileName)
      sendConfig(name, event)
    })
    // 请求原文翻译
    ipcMain.on(IpcTypes.TRANSLATE_ORIGINAL_TEXT, async (event, text: string) => {
      try {
        const translateOriginalText = await TranslationManager.getInstance().translateText(text, 'textTranslation')
        event.sender.send(IpcTypes.HAS_TRANSLATION, translateOriginalText)
      }
      catch (e) {
        throw new Error('ipc translate error')
      }
    })
    // mecab翻译
    ipcMain.on(IpcTypes.TRANSLATE_MECAB_TEXT, async (event: IpcMainEvent, dataKey: string, text: string, reading: string, romaji: string, saveInAnki: string) => {
      const selectDataKey = dataKey
      const selectReading = reading
      const seletcRomaji = romaji
      const selectText = text
      const seleSaveInAnki = saveInAnki
      const translateOriginalText = await TranslationManager.getInstance().translateText(text, 'mecabTranslation')
      // 返回meacab翻译结果
      event.sender.send(IpcTypes.HAS_MECAB_TEXT, translateOriginalText)
      if (typeof translateOriginalText === 'object' && 'mp3Url' in translateOriginalText) {
        requestStoreInRedis(selectDataKey, selectText, translateOriginalText.result, translateOriginalText.mp3Url, selectReading, seletcRomaji, seleSaveInAnki)
      }
    })
    ipcMain.on(IpcTypes.CHECK_WORD_IN_REDIS, async (event: IpcMainEvent, dataKey: string) => {
      try {
        const result = await StoreInRedis.getInstance().checkWordInfo(dataKey)
        event.sender.send(IpcTypes.HAS_CHECK_MECAB_EXIST, result)
      }
      catch (e) {
        console.log(e)
      }
    })
    // 获取redis中的mecab信息
    ipcMain.on(IpcTypes.GET_REDIS_MECAB_INFO, async (event: IpcMainEvent, dataKey: string) => {
      try {
        const result = await StoreInRedis.getInstance().getWordInfo(dataKey)
        event.sender.send(IpcTypes.HAS_MECAB_TEXT_IN_REDIS_INFO, result)
      }
      catch (e) {
        console.log(e)
      }
    })
    // 获取窗口总在最上方
    ipcMain.on(IpcTypes.TOGGLE_ALWAYS_ON_TOP, (event: IpcMainEvent) => {
      const focusedWindow = BrowserWindow.getFocusedWindow();
      if (focusedWindow) {
        const currentStatus = focusedWindow.isAlwaysOnTop();
        focusedWindow.setAlwaysOnTop(!currentStatus);
        event.reply(IpcTypes.ALWAYS_ON_TOP_CHANGED, !currentStatus);
      }
    });
    ipcMain.on(
      IpcTypes.REQUEST_SAVE_TRANSLATOR_GUI,
      (event: IpcMainEvent, cfg: any) => {
        logger.debug('request saving translator gui config...')
        ConfigManager.getInstance().set<yuki.Config.Gui>('gui', {
          ...ConfigManager.getInstance().get('gui'),
          translatorWindow: cfg
        })
        logger.debug('translator gui config saved')
      }
    )
    // 返回对应的类型
    async function sendConfig(configName: string, event: Electron.IpcMainEvent) {
      const configData = ConfigManager.getInstance().get(configName)
      event.reply(
        IpcTypes.HAS_CONFIG,
        configName,
        configData
      );
    }
    //redis操作
    async function requestStoreInRedis(dataKey: string, text: string, translation: string, audioUrl: string, reading: string, romaji: string, saveInAnki: string) {
      try {
        await StoreInRedis.getInstance().storeWordInfo(dataKey, text, translation, audioUrl, reading, romaji, saveInAnki);
      } catch (error) {
        logger.error(`fail to save in redis the key is:${dataKey}`)
      }
    }
  }
}
