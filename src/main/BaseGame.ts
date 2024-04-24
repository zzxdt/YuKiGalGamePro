import { EventEmitter } from 'events'
import Hooker from './Hooker'
import { registerProcessExitCallback } from './Win32'
import { logger } from './Log/LogCollector'
export default abstract class BaseGame extends EventEmitter {
  protected pids: number[]
  constructor() {
    super()
    this.pids = []
  }

  public abstract start(): void

  public getPids() {
    return this.pids
  }

  public abstract getInfo(): yuki.Game

  protected async afterGetPids() {
    // 绑定pid
    await this.injectProcessByPid()
    // 注册进程退出回调
    this.registerProcessExitCallback()
    this.emit('started', this)
  }
  // 如果打开多个游戏为每个游戏注入进程
  private async injectProcessByPid() {
    await Promise.all(this.pids.map((pid) => Hooker.getInstance().injectProcess(pid)))
    logger.debug('inject process success')
  }

  private registerProcessExitCallback() {
    registerProcessExitCallback(this.pids, () => {
      this.emit('exited', this)
    })
  }
}
