import { app, Tray, Menu } from 'electron'
import Constants from './utils/Constants'
import path from 'path'
import { createErrorWindow, createMainWindow } from './MainRunner'
import { macOSDisableDefaultMenuItem } from './utils/Menus'
require('dotenv').config();
require('@electron/remote/main').initialize();
let mainWindow
let errorWindow
app.on('ready', async () => {
  if (Constants.IS_DEV_ENV) {
    import('./index.dev')
  }

  macOSDisableDefaultMenuItem()
  mainWindow = await createMainWindow(mainWindow)
  require('@electron/remote/main').enable(mainWindow.webContents);
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
  const pathyuki = path.resolve(__dirname, '../../src/renderer/asserts/icon/whiteyuki.png')
  const homeyuki = path.resolve(__dirname, '../../src/renderer/asserts/icon/home.png')
  const exityuiki = path.resolve(__dirname, '../../src/renderer/asserts/icon/exit.png')
  let tray = new Tray(pathyuki);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '打开主界面',
      icon: homeyuki,
      click: function () {
        mainWindow.show();
      }
    },
    {
      label: '退出',
      icon: exityuiki,
      click: function () {
        app.quit();
      }
    }
  ]);
  tray.setToolTip('YuKiGalGameE');
  tray.setTitle('Open YuKiGalGameE')
  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    mainWindow.show();
  });
})
process.on('uncaughtException', () => {
  errorWindow = createErrorWindow(errorWindow, mainWindow)
})