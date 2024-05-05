import { exec } from 'child_process'
import { logger } from './Log/LogCollector'

export default class Processes {
  public static async get() {
    return new Promise<yuki.Processes>((resolve, reject) => {
      exec(
        `${Processes.CHCP_COMMAND} & ${Processes.TASK_LIST_COMMAND}`,
        (err, stdout: string, stderr) => {
          if (err) {
            logger.error('exec failed !> %s', err)
            reject()
            return
          }
          if (this.findsProcessIn(stdout)) {
            const result = this.parseProcessesFrom(stdout)
            logger.debug('get %d processes', result.length)
            // 返回进程数组
            resolve(result)
          } else {
            logger.debug('exec failed. no process:', `${stderr}`)
            reject()
          }
        }
      )
    })
  }
  private static CHCP_COMMAND = 'chcp 65001'
  private static TASK_LIST_COMMAND = 'tasklist /nh /fo csv /fi "sessionname eq Console"'

  private static findsProcessIn(value: string) {
    return value.indexOf('"') !== -1
  }
  // 过滤进程文字
  private static parseProcessesFrom(value: string) {
    const processes: yuki.Processes = []

    const regexResult = value.match(/"([^"]+)"/g)
    if (!regexResult) return []

    let onePair: yuki.Process = { name: '', pid: -1 }
    for (let i = 0; i < regexResult.length; i++) {
      if (i % 5 === 0) {
        // process name
        onePair.name = regexResult[i].substring(1, regexResult[i].length - 1)
      } else if (i % 5 === 1) {
        // process id
        onePair.pid = parseInt(regexResult[i].substring(1, regexResult[i].length - 1), 10)
        processes.push(onePair)
        onePair = { name: '', pid: -1 }
      }
    }

    return processes
  }
}
