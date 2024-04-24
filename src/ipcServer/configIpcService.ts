import { configStore } from '@/renderer/store/config'
import { guiStore } from '@/renderer/store/gui'
import IpcTypes from '@/common/IpcTypes'
class ConfigIpcService {
  init() {
    this.registerEventListeners()
  }
  private async registerEventListeners() {
    const useConfigStore = configStore()
    const useGuiStore = guiStore()
    window.mainApi.loadGameAtStart('games')
    window.mainApi.loadGameAtStart('default')
    window.mainApi.receive(IpcTypes.HAS_CONFIG, (name: string, cfgs: any) => {
      try {
        useConfigStore.setConfig({ name, cfgs });
      } catch (error) {
        console.error('Error handling IPC config message:', error);
      }
    })
    window.mainApi.receive(IpcTypes.HAS_PROCESSES, (processes: yuki.Processes) => {
      useGuiStore.setProcesses(processes)
    })
  }
  public unregisterEventListeners() {
    window.mainApi.off(IpcTypes.HAS_CONFIG)
    window.mainApi.off(IpcTypes.HAS_PROCESSES)
  }
}
export const configIpcService = new ConfigIpcService()
