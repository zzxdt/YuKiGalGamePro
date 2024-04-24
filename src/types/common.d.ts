declare namespace yuki {
  export interface Middleware<T> {
    process: (context: T, next: (newConetxt: T) => Promise<void>) => Promise<void>
  }
  export interface Process {
    name: string
    pid: number
  }
  export type Processes = Process[]
  export interface ProcessWithText extends Process {
    text: string
  }
  export type ProcessWithTexts = ProcessWithText[]
}
