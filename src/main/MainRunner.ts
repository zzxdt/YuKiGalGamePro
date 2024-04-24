import { BrowserWindow, RenderProcessGoneDetails } from 'electron'
import Constants from './utils/Constants'
import IPCs from './IPCs'
import IpcTypes from '@/common/IpcTypes'
import ConfigManager from './config/ConfigManager'
import path from 'path'
export const createMainWindow = async (mainWindow: BrowserWindow): Promise<BrowserWindow> => {
  const icon = path.resolve(__dirname, '../../src/renderer/asserts/icon/whiteyuki.png')
  mainWindow = new BrowserWindow({
    title: Constants.APP_NAME,
    show: false,
    width: Constants.IS_DEV_ENV ? 1030 : 1050,
    height: 752,
    frame: false,
    icon: icon,
    minWidth: 1000,
    maxWidth: 1050,
    minHeight: 500,
    maxHeight: 752,
    useContentSize: true,
    webPreferences: Constants.DEFAULT_WEB_PREFERENCES
  })

  mainWindow.setMenu(null)
  mainWindow.webContents.on('did-finish-load', () => {
    // 加载完成后发送数据到渲染进程，使用主进程发送直接接受就行
    const gamesData = ConfigManager.getInstance().get('games');
    const defauleConfig = ConfigManager.getInstance().get('default')
    const textsData = ConfigManager.getInstance().get('texts')
    mainWindow.webContents.send(IpcTypes.HAS_CONFIG, 'games', gamesData);
    mainWindow.webContents.send(IpcTypes.HAS_CONFIG, 'default', defauleConfig)
    mainWindow.webContents.send(IpcTypes.HAS_CONFIG, 'texts', textsData)
  });
  mainWindow.once('ready-to-show', (): void => {
    mainWindow.show()
    mainWindow.focus()
    mainWindow.setAlwaysOnTop(false)
  })
  // Initialize IPC Communication
  IPCs.initialize(mainWindow)
  if (Constants.IS_DEV_ENV) {
    // Test!
    await mainWindow.loadURL(Constants.APP_INDEX_URL_DEV)
  } else {
    await mainWindow.loadFile(Constants.APP_INDEX_URL_PROD)
  }

  return mainWindow
}

export const createErrorWindow = async (
  errorWindow: BrowserWindow,
  mainWindow: BrowserWindow,
  details?: RenderProcessGoneDetails
): Promise<BrowserWindow> => {
  if (!Constants.IS_DEV_ENV) {
    mainWindow?.hide()
  }
  errorWindow = new BrowserWindow({
    title: Constants.APP_NAME,
    show: false,
    resizable: Constants.IS_DEV_ENV,
    webPreferences: Constants.DEFAULT_WEB_PREFERENCES
  })

  errorWindow.setMenu(null)

  if (Constants.IS_DEV_ENV) {
    await errorWindow.loadURL(`${Constants.APP_INDEX_URL_DEV}#/error`)
  } else {
    await errorWindow.loadFile(Constants.APP_INDEX_URL_PROD, { hash: 'error' })
  }

  errorWindow.on('ready-to-show', (): void => {
    if (!Constants.IS_DEV_ENV && mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.destroy()
    }
    errorWindow.show()
    errorWindow.focus()
  })

  errorWindow.webContents.on('did-frame-finish-load', (): void => {
    if (Constants.IS_DEV_ENV) {
      errorWindow.webContents.openDevTools()
    }
  })

  return errorWindow
}
