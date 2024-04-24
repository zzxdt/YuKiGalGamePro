import IpcTypes from "@/common/IpcTypes";
import { TranslatorHookStore } from "../store/module/Hook";
import { TranslatorConfigStore } from "../store/module/Config";
class ConfigIpcService {
  init() {
    this.registerEventListeners()
  }
  private registerEventListeners() {
    const useTranslatorHookStore = TranslatorHookStore()
    const useTranslatorConfigStore = TranslatorConfigStore()
    window.mainApi.loadGameAtStart('gui')
    window.mainApi.loadGameAtStart('default')
    window.mainApi.hasHookText((textOutputContext: yuki.TextOutputObject) => {
      const { handle, text, formattedText, name, code, pid } = textOutputContext;
      useTranslatorHookStore.addText(handle, { handle, name, code, pid, text }, { formattedText });
    })
    window.mainApi.receive(IpcTypes.WINDOWS_RESIZE, ({ width, height }) => {
      useTranslatorConfigStore.setWindows({ width, height })
    })
    window.mainApi.receive(IpcTypes.HAS_CONFIG, (name: string, cfgs: any) => {
      try {
        useTranslatorConfigStore.setConfig({ name, cfgs });
      } catch (error) {
        console.error('Error handling IPC config message:', error);
      }
    })
  }
  public unregisterEventListeners() {
    window.mainApi.off(IpcTypes.WINDOWS_RESIZE);
    window.mainApi.off(IpcTypes.HAS_CONFIG);
    window.mainApi.off(IpcTypes.HAS_HOOK_TEXT);
  }
}
const configIpcService = new ConfigIpcService()
export { configIpcService }