import { exec } from 'child_process'
import { logger } from './Log/LogCollector'
import BaseGame from './BaseGame'
import ConfigManager from './config/ConfigManager'
const spawn = require('child_process').spawn
export default class Game extends BaseGame {
  private static readonly TIMEOUT = 1000
  private static readonly MAX_RESET_TIME = 10
  private path: string
  private code: string
  private name: string
  private localChangers: yuki.Config.LocaleChangerItems
  private localeChanger: string
  private exeName: string
  private execPath: string
  constructor(game: yuki.Game) {
    super()
    this.path = game.path
    this.pids = []
    this.code = game.code
    this.name = game.name
    this.localeChanger = game.localeChanger
    this.exeName = this.path.substring(this.path.lastIndexOf('\\') + 1)
    this.localChangers =
      ConfigManager.getInstance().get<yuki.Config.Default>('default').localeChangers
    this.execPath = this.localChangers[this.localeChanger].exec
  }
  public start() {
    this.registerHookerWithPid()
  }
  //启动游戏
  private async startGame() {
    try {
      if (this.execPath === '' || this.execPath === '%GAME_PATH%') {
        const gameProcess = spawn(this.path, [], { detached: true, stdio: 'ignore' })
        gameProcess.unref()
      } else {
        const args = ['-run', this.path]
        const gameProcess = spawn(this.execPath, args, { detached: true, stdio: 'ignore' })
        gameProcess.unref()
      }
    } catch (error) {
      logger.error('start gaming error:', error)
      throw error
    }
  }
  public getInfo(): yuki.Game {
    return {
      name: this.name,
      code: this.code,
      path: this.path,
      localeChanger: this.localeChanger
    }
  }

  // 启动游戏
  private async registerHookerWithPid() {
    logger.debug('finding pid of %s...', this.name)
    try {
      await this.startGame()
      // 寻找pid函数
      await this.findPids()
      await this.afterGetPids()
    } catch (e) {
      logger.info('could not find game %s. abort', this.name)
      this.emit('abort')
      this.emit('exited')
      return
    }
  }

  private async findPids() {
    return new Promise((resolve, reject) => {
      let retryTimes = 0
      const pidGetterInterval = setInterval(() => {
        exec(`tasklist /nh /fo csv /fi "imagename eq ${this.exeName}"`, (err, stdout, stderr) => {
          if (err) throw err
          if (retryTimes >= Game.MAX_RESET_TIME) {
            clearInterval(pidGetterInterval)
            reject()
          }
          if (this.findsPidsIn(stdout)) {
            clearInterval(pidGetterInterval)
            this.pids = this.parsePidsFrom(stdout)
            logger.debug('has findProcess name is', this.pids)
            resolve(this.pids)
          } else {
            retryTimes++
            logger.debug('could not find game. retry times...', retryTimes)
          }
        })
      }, Game.TIMEOUT)
    })
  }

  private findsPidsIn(value: string) {
    return value.startsWith('"')
  }
  // 预防打开多个相同游戏
  private parsePidsFrom(value: string) {
    const pids: number[] = []
    const regexResult = value.match(/"[^"]+"/g)
    if (!regexResult) return []

    for (let i = 0; i < regexResult.length; i++) {
      if (i % 5 !== 1) continue

      pids.push(parseInt(regexResult[i].replace('"', ''), 10))
    }
    return pids
  }
}
