import { contextBridge, ipcMain, ipcRenderer, IpcRendererEvent } from 'electron'
import IpcTypes from '@/common/IpcTypes'
import * as cheerio from 'cheerio'
// Whitelist of valid channels used for IPC communication (Send message from Renderer to Main)
const mainAvailChannels: string[] = [
  'msgRequestGetVersion',
  'msgOpenExternalLink',
  'minimizeApp',
  'closeApp',
  'restartApp',
  'reuquestProcess',
  'requestRunGame',
  'requestRemoveGame',
  'requestSaveConfig',
  'openFolder',
  'requestNewGamePath',
  'requestInsertHooks',
  'requestConfig',
  'requestAddGame',
  'requestSaveTranslatorGUi',
  'requestPathWithFile',
  'appExit',
  'requestTranslations',
  'requestDict',
  'requestDownloadLibrary',
  'loadGameAtStart',
  'requestSaveTranslatorGui',
  'toggleAlwaysOnTop',
  'translateOrignalText',
  'translateMecabText',
  'getRedisMecabInfo',
  'checkWordInRedis',
  'resizeWindow',
  'hideTranslateWindows',
  'sendWordToAnki',
  'checkWordInAnki',
  'removeWordFromAnki',
  'requestInsertHook',
  'deleteAllWordInRedis',
  'checkAllWordInRedis',
  'quitRedis',
  'showMianWindows',
  'checkRedisStatus'
]
const rendererAvailChannels: string[] = [
  `${IpcTypes.HAS_PROCESSES}`,
  `${IpcTypes.HAS_CONFIG}`,
  `${IpcTypes.REQUEST_RUN_GAME}`,
  `${IpcTypes.HAS_ADDED_GAME}`,
  `${IpcTypes.HAS_NEW_GAME_PATH}`,
  `${IpcTypes.HAS_RUNNING_GAME}`,
  `${IpcTypes.HAS_NEW_DEBUG_MESSAGE}`,
  `${IpcTypes.GAME_ALREADY_EXISTS}`,
  `${IpcTypes.ALWAYS_ON_TOP_CHANGED}`,
  `${IpcTypes.HAS_HOOK_TEXT}`,
  `${IpcTypes.HAS_TRANSLATION}`,
  `${IpcTypes.HAS_MECAB_TEXT}`,
  `${IpcTypes.HAS_MECAB_TEXT_IN_REDIS_INFO}`,
  `${IpcTypes.HAS_CHECK_MECAB_EXIST}`,
  `${IpcTypes.HAS_GUI_INFORM}`,
  `${IpcTypes.HAS_ANKI}`,
  `${IpcTypes.HAS_WORD_IN_ANKI}`,
  `${IpcTypes.HAS_REMOVE_WORD_FROM_ANKI}`,
  `${IpcTypes.HAS_ALL_WORD_FROM_REDIS}`,
  `${IpcTypes.HAS_DELETE_ALL_FROM_REDIS}`,
  `${IpcTypes.WINDOWS_RESIZE}`,
  `${IpcTypes.CURRENT_REDIS_STATUS}`,
  `${IpcTypes.HAS_PATH_WITH_FILE}`
]
function parseHTML(htmlString: string) {
  const $ = cheerio.load(htmlString)
  let extractedText = ''
  $('span').each((index, element) => {
    extractedText += $(element).text()
  })
  return extractedText.trim()
}
contextBridge.exposeInMainWorld('mainApi', {
  // 处理mecab 分词的span标签
  parseHTML: parseHTML,
  send: (channel: string, ...data: any[]): void => {
    if (mainAvailChannels.includes(channel)) {
      ipcRenderer.send.apply(null, [channel, ...data])
    } else {
      throw new Error(`Unknown ipc channel name: ${channel}`)
    }
  },
  sendSync: (channel: string, ...data: any[]): any => {
    if (mainAvailChannels.includes(channel)) {
      return ipcRenderer.sendSync.apply(null, [channel, ...data])
    }
    throw new Error(`Unknown ipc channel name: ${channel}`)
  },
  on: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void): void => {
    if (rendererAvailChannels.includes(channel)) {
      ipcRenderer.on(channel, listener)
    } else {
      throw new Error(`Unknown ipc channel name: ${channel}`)
    }
  },
  once: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void): void => {
    if (rendererAvailChannels.includes(channel)) {
      ipcRenderer.once(channel, listener)
    } else {
      throw new Error(`Unknown ipc channel name: ${channel}`)
    }
  },
  off: (channel: string, listener: (event: IpcRendererEvent, ...args: any[]) => void): void => {
    if (rendererAvailChannels.includes(channel)) {
      ipcRenderer.off(channel, listener)
    } else {
      throw new Error(`Unknown ipc channel name: ${channel}`)
    }
  },
  invoke: async (channel: string, ...data: any[]): Promise<any> => {
    if (mainAvailChannels.includes(channel)) {
      const result = await ipcRenderer.invoke.apply(null, [channel, ...data])
      return result
    }

    throw new Error(`Unknown ipc channel name: ${channel}`)
  },
  receive: (channel: string, listener) => {
    if (rendererAvailChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => listener(...args))
    } else {
      throw new Error(`Unknown ipc channel name: ${channel}`)
    }
  },

  // 自定义发送至主进程方法区
  minimizeApp: () => ipcRenderer.send(IpcTypes.MINISIZE_APP),
  closeApp: () => ipcRenderer.send(IpcTypes.CLOSE_APP),
  restartApp: () => ipcRenderer.send(IpcTypes.RESTART_APP),
  requestProcess: () => ipcRenderer.send(IpcTypes.REQUEST_PROCESSES),
  requestRunGame: (game?: yuki.Game, stratFromProcess?: yuki.Process) =>
    ipcRenderer.send(IpcTypes.REQUEST_RUN_GAME, game, stratFromProcess),
  requestRemoveGame: (games: yuki.Game) => ipcRenderer.send(IpcTypes.REQUEST_REMOVE_GAME, games),
  requestSaveConfig: (name: string, savingConfig: any) =>
    ipcRenderer.send(IpcTypes.REQUEST_SAVE_CONFIG, name, savingConfig),
  openFolder: (path: string) => ipcRenderer.send(IpcTypes.OPEN_FLODER, path),
  requestNewGamePath: () => ipcRenderer.send(IpcTypes.REQUEST_NEW_GAME_PATH),
  requestAddGame: (game: yuki.Game) => ipcRenderer.send(IpcTypes.REQUEST_ADD_GAME, game),
  requestInsertHooks: (code: string) => ipcRenderer.send(IpcTypes.REQUEST_INSERT_HOOK, code),
  requestConfig: () => ipcRenderer.send(IpcTypes.REQUEST_CONFIG),
  requestSaveTranslatorGUi: () => ipcRenderer.send(IpcTypes.REQUEST_SAVE_TRANSLATOR_GUI),
  requestPathWithFile: () => ipcRenderer.send(IpcTypes.REQUEST_PATH_WITH_FILE),
  appExit: () => ipcRenderer.send(IpcTypes.APP_EXIT),
  requestTranslations: () => ipcRenderer.send(IpcTypes.REQUEST_TRANSLATION),
  requestDict: () => ipcRenderer.send(IpcTypes.REQUEST_DICT),
  loadGameAtStart: (configName: string) =>
    ipcRenderer.send(IpcTypes.LOAD_GAME_AT_START, configName),
  toggleDevTools: () => ipcRenderer.send(IpcTypes.TOOGLE_DEV_TOOLS),
  requestSaveTranslatorGui: (currentWindow: object) =>
    ipcRenderer.send(IpcTypes.REQUEST_SAVE_TRANSLATOR_GUI, currentWindow),
  translateOrignalText: (origonalText: string) =>
    ipcRenderer.send(IpcTypes.TRANSLATE_ORIGINAL_TEXT, origonalText),
  translateMecabText: (
    dataKey: string,
    mecabText: string,
    reading: string,
    romaji: string,
    saveInAnki: string
  ) =>
    ipcRenderer.send(
      IpcTypes.TRANSLATE_MECAB_TEXT,
      dataKey,
      mecabText,
      reading,
      romaji,
      saveInAnki
    ),
  toggleAlwaysOnTop: () => {
    ipcRenderer.send(IpcTypes.TOGGLE_ALWAYS_ON_TOP)
  },
  getRedisMecabInfo: (wordKey: string) => ipcRenderer.send(IpcTypes.GET_REDIS_MECAB_INFO, wordKey),
  checkWordInRedis: (wordKey: string) => ipcRenderer.send(IpcTypes.CHECK_WORD_IN_REDIS, wordKey),
  showMianWindows: () => ipcRenderer.send(IpcTypes.SHOW_MAINWINDOWS),
  requestInsertHook: (code: string) => ipcRenderer.send(IpcTypes.REQUEST_INSERT_HOOK, code),
  //调整翻译窗口得大小
  resizeWindow: (x: number, y: number) => ipcRenderer.send(IpcTypes.RESIZE_WINDOWS, x, y),
  //发送单词至anki
  sendWordToAnki: (original: string, reading: string, translation: string, audioURL: string) => {
    ipcRenderer.send(IpcTypes.SEND_TO_ANKI, original, reading, translation, audioURL)
  },
  checkWordInAnki: (original: string) => {
    ipcRenderer.send(IpcTypes.CHECK_WORD_IN_ANKI, original)
  },
  checkRedisStatus: (status: boolean) => {
    ipcRenderer.send(IpcTypes.REDIS_STATUS, status)
  },
  hideTranslateWindows: () => {
    ipcRenderer.send(IpcTypes.HIDE_TRANSLATEWINDOWS)
  },
  removeWordFromAnki: (original: string) => {
    ipcRenderer.send(IpcTypes.REMOVE_WORD_FROM_ANKI, original)
  },
  //redis管理方法的实现
  deleteAllWordInRedis: () => {
    ipcRenderer.send(IpcTypes.DELETE_ALL_WORD_IN_REDIS)
  },
  checkAllWordInRedis: () => {
    ipcRenderer.send(IpcTypes.CHECK_ALL_WORD_IN_REDIS)
  },
  quitRedis: () => {
    ipcRenderer.send(IpcTypes.QUIT_REDIS)
  },
  // 自定义发送至子进程方法区
  // callback 返回函数，接收到数据进行处理
  hasConfig: (callback: (name: string, cfgs: object) => void) => {
    ipcRenderer.on(IpcTypes.HAS_CONFIG, (event: IpcRendererEvent, name, cfgs) =>
      callback(name, cfgs)
    )
  },
  hasHookText: (callback: any) => {
    ipcRenderer.on(IpcTypes.HAS_HOOK_TEXT, (event: IpcRendererEvent, textInPutContext) =>
      callback(textInPutContext)
    )
  }
})
