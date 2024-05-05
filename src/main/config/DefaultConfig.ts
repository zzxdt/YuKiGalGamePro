import Config from './Config'
export default class DefaultConfig extends Config {
  constructor() {
    super()
  }
  public getFilename(): string {
    return 'default'
  }
  protected getDefaultObject(): yuki.Config.Default {
    return {
      //关于路径问题，由于是在根目录下的dist下的main的文件中
      onlineApis: [
        {
          enable: false,
          external: true,
          jsFile: '../../../translateApi/CloudTencent.js',
          name: '腾讯云',
          apiType: 'mecabTranslation',
          selectSwitchDisable: false
        },
        {
          enable: true,
          external: true,
          jsFile: '../../../translateApi/OpenBaidu.js',
          name: '百度翻译平台',
          apiType: 'textTranslation',
          selectSwitchDisable: false
        },
        {
          enable: true,
          external: true,
          jsFile: '../../../translateApi/YouDaoApi.js',
          name: '有道云翻译平台',
          apiType: 'mecabTranslation',
          selectSwitchDisable: false
        }
      ],
      localeChangers: {
        localEmulator: {
          name: 'LocalEmulator',
          enable: true,
          exec: ''
        },
        noChanger: { name: 'No Changer', enable: false, exec: '%GAME_PATH%' }
      },
      mecab: true,
      redis: true,
      anki: true,
      textTranslationApi: '百度翻译平台',
      mecabTranslationApi: '有道云翻译平台'
    }
  }
}
