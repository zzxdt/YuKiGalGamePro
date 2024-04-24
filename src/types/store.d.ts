declare namespace yuki {
  export interface SettingsState {
    localeChangers: TempLocaleChangerItem[]
  }

  type TempLocaleChangerItem = yuki.Config.localeChangerItem & { id: string }

  export interface TextOutputObject extends TextThread {
    text: string,
    formattedText?: string; // 格式化后的文本
  }
  export interface TextThread {
    handle: number; // hook index
    pid: number; // process ID
    addr: number; // hook address
    ctx: number; // hook context
    ctx2: number; // hook context 2
    name: string; // hook name
    code: string; // hook code
    text: string; // output text
  }
  export interface MeCabResult {
    word: string; // 分词
    reading: string; // 读音（平假名）
    romaji: string; // 罗马字
    pos: string; // 词性
    baseForm: string; // 基本形式
    verbType?: string;
  }
  export interface TranslationMessage {
    id: number
    translation: Translations['translations']
  }

  export interface Game {
    name: string
    path: string
    code: string
    localeChanger: string
  }
  export interface ConfigState {
    default: yuki.Config.Default
    games: Game[],
    texts: yuki.Config.Texts
    librariesBaseStorePath: string
  }

  export interface GuiState {
    noGame: boolean
    debugMessages: string[]
    isGameStartingEnded: boolean
    processes: Processes
  }

  export interface TranslatorHookState {
    isMecabEnable: boolean
    hookInfos: TextThread[]
    texts: {
      [handle: string]: string[]
    }
    patterns: {
      [handle: string]: yuki.MeCabPatterns[]
    }
    currentDisplayHookIndex: number
    translations: {
      [handle: string]: Array<Translations['translations']>
    }
    toDisplayHookCode: string
  }

  export interface TranslatorConfigState {
    default: yuki.Config.Default
    game: Game
    translatorWindow: yuki.Config.Gui['translatorWindow']
  }
  export interface MecabText extends FontStyle {
    fontPadding: number
  }
  export interface FontStyle {
    fontSize: number
    color?: string
  }

  export interface TranslationTextStyle extends FontStyle {
    margin: number
  }

  export interface TranslatorViewState {
    isButtonsShown: boolean
    isWindowTooHigh: boolean
    pauseNewText: boolean
    dict: DictResult
    isGetDictResult: boolean
  }
}
