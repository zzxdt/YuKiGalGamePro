declare namespace yuki {
  export interface Translations {
    original: string
    translations: {
      [apiName: string]: string
    }
  }

  export interface Translator {
    async translate(text: string)
    isEnable(): boolean
    setEnable(isEnable: boolean): void
    getName(): string
  }
}
