import { app, Tray, Menu } from 'electron'
import Constants from './utils/Constants'
import path from 'path'
import { createErrorWindow, createMainWindow } from './MainRunner'
import { macOSDisableDefaultMenuItem } from './utils/Menus'
require('@electron/remote/main').initialize()
let mainWindow
let errorWindow
app.on('ready', async () => {
  if (Constants.IS_DEV_ENV) {
    import('./index.dev')
  }

  macOSDisableDefaultMenuItem()
  mainWindow = await createMainWindow(mainWindow)
  require('@electron/remote/main').enable(mainWindow.webContents)
})

app.on('activate', async () => {
  if (!mainWindow) {
    mainWindow = await createMainWindow(mainWindow)
  }
})

app.on('window-all-closed', () => {
  mainWindow = null
  errorWindow = null
  if (!Constants.IS_MAC) {
    app.quit()
  }
})
app.whenReady().then(() => {
  let pathyuki: any
  let homeyuki: any
  let exityuiki: any
  if (Constants.IS_DEV_ENV) {
    pathyuki = path.resolve(__dirname, '../../static/images/whiteyuki.png')
    homeyuki = path.resolve(__dirname, '../../static/images/home.png')
    exityuiki = path.resolve(__dirname, '../../static/images/exit.png')
  } else {
    pathyuki = path.resolve(__dirname, '../whiteyuki.png')
    homeyuki = path.resolve(__dirname, '../home.png')
    exityuiki = path.resolve(__dirname, '../exit.png')
  }
  let tray = new Tray(pathyuki)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '打开主界面',
      icon: homeyuki,
      click: function () {
        if (mainWindow) {
          mainWindow.show()
        }
      }
    },
    {
      label: '退出',
      icon: exityuiki,
      click: function () {
        app.quit()
      }
    }
  ])
  tray.setToolTip('YuKiGalGamePro')
  tray.setTitle('Open YuKiGalGamePro')
  tray.setContextMenu(contextMenu)
  tray.on('click', () => {
    mainWindow.show()
  })
})
process.on('uncaughtException', () => {
  errorWindow = createErrorWindow(errorWindow, mainWindow)
})
