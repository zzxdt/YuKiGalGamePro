import BaseGame from './BaseGame'

export default class GameFromProcess extends BaseGame {
  private process: yuki.Process

  constructor(process: yuki.Process) {
    super()
    this.process = process
    this.pids = [process.pid]
  }
  public getInfo(): yuki.Game {
    return {
      name: this.process.name.replace('.exe', ''),
      code: '',
      path: '',
      localeChanger: ''
    }
  }
  public start() {
    try {
      this.afterGetPids()
    } catch (e) {
      console.log(e)
    }
  }
}
