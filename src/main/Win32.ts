import koffi from 'koffi'
import { logger } from './Log/LogCollector'
const SYNCHRONIZE = 0x00100000
const FALSE = 0
const INFINITE = 0xffffffff
const knl32 = koffi.load('kernel32.dll')
const OpenProcess = knl32.func('OpenProcess', 'uint32', ['uint32', 'int', 'uint32'])
const WaitForSingleObject = knl32.func('WaitForSingleObject', 'uint32', ['uint32', 'uint32'])

export function registerProcessExitCallback(pids: number[], callback: () => void): void {
  doRegister(pids, callback, 0)
}

function doRegister(pids: number[], callback: () => void, index: number) {
  if (index === pids.length) {
    callback()
    return
  }
  logger.debug('registering process exit callback at pid %d...', pids[index])
  const hProc = OpenProcess(SYNCHRONIZE, FALSE, pids[index])
  logger.debug('process handle: %d', hProc)
  WaitForSingleObject.async(hProc, INFINITE, () => {
    doRegister(pids, callback, index + 1)
  })
  logger.debug('process exit callback registered')
}
