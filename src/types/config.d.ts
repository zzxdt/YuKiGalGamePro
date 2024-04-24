///<reference types="electron" />
declare namespace yuki {
  namespace Config {
    export interface Config { }
    export interface LocaleChangerItems {
      [id: string]: LocaleChangerItem
    }
    export interface LocaleChangerItem {
      name: string
      enable: boolean
      exec: string
    }
    export interface OnlineApiItem {
      name: string
      enable: boolean
      url?: string
      method?: string
      external?: boolean
      jsFile?: string
      apiType?: 'textTranslation' | 'mecabTranslation';
      selectSwitchDisable: boolean
    }
    export interface LibraryItem {
      enable: boolean
    }
    export interface Libraries {
      mecab: boolean,
      redis: boolean,
      anki: boolean,
    }
    export interface Default extends Libraries, Config {
      onlineApis: OnlineApiItem[];
      localeChangers: LocaleChangerItems
      textTranslationApi: string; // 用于翻译原文的API标识符
      mecabTranslationApi: string;
    }
    export interface Texts extends Config {
      interceptor: {
        shouldBeIgnore: string[]
        ignoreAsciiOnly: boolean
        maxLength: number
      }
      modifier: {
        removeAscii: boolean
        deduplicate: boolean
        delineBreak: boolean
      }
      merger: {
        enable: boolean
        timeout: number
      }
    }
    // 翻译器打开后Gui
    export interface Gui extends Config {
      translatorWindow: {
        bounds: Electron.Rectangle;
        originalText: FontStyle;
        translationText: TranslationTextStyle;
        background: string;
        sizes: {
          '/translate': Electron.Rectangle,
          '/hook': Electron.Rectangle,
          '/setting': Electron.Rectangle,
        };
        mecabReading: FontStyle;
        renderMode: 'transparent';
        mecabText: MecabText
      }
    }
    export interface Games extends Array<Game>, Config { }
  }
}
