import { join, dirname } from 'path'
import { name, version } from '../../../package.json'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default class Constants {
  // Display app name (uppercase first letter)
  static APP_NAME = name.charAt(0).toUpperCase() + name.slice(1)

  static APP_VERSION = version

  static IS_DEV_ENV = process.env.NODE_ENV === 'development'

  static IS_MAC = process.platform === 'darwin'

  static DEFAULT_WEB_PREFERENCES = {
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false,
    preload: join(__dirname, '../preload/index.js')
  }

  static APP_INDEX_URL_DEV = 'http://localhost:5173/index.html'
  static APP_INDEX_URL_PROD = join(__dirname, '../index.html')
  static APP_TRANSLATOR_URL_DEV = 'http://localhost:5173/translator/translator.html'
  static APP_TRANSLATOR_URL_PROD = join(__dirname, '../translate.html')
}
