import { defineStore } from 'pinia'
interface debugMessage {
  level: string
  message: string
  meta: any
}
const MAX_DEBUG_MESSAGES_COLUMNS = 1000
const guiStore = defineStore('Gui', {
  state: (): yuki.GuiState => ({
    noGame: true,
    debugMessages: [],
    isGameStartingEnded: false,
    processes: []
  }),
  getters: {
    getProcessesWithText: (state: yuki.GuiState) => () => {
      // Processes包含了很多process对象
      return state.processes.map((process) => ({
        ...process,
        text: `${process.pid} - ${process.name}`
      }))
    },
    getDebugMessage: (state) => {
      return state.debugMessages
    }
  },
  actions: {
    setNoGame(value: boolean) {
      this.noGame = value
    },
    //接受新的日志文件
    newDebugMessage(message: debugMessage) {
      const mdebug = `${message.level}:${message.message}:${message.meta}`
      this.debugMessages.push(mdebug)
      if (this.debugMessages.length > MAX_DEBUG_MESSAGES_COLUMNS) {
        this.debugMessages.shift()
      }
    },
    setGameStartingEnded(value: boolean) {
      this.isGameStartingEnded = value
    },
    setProcesses(value: yuki.Processes) {
      this.processes = value
    }
  }
})
export { guiStore }
