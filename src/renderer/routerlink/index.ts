// 设置主内容
const sidebarLinks = [
  //省略2个页面以后会补充
  { path: '/games', icon: 'mdi-gamepad', text: 'mainSilderBar.myGames' },
  { path: '/addgame', icon: 'mdi-plus-box-multiple', text: 'mainSilderBar.addGame' },
  // { path: '/debugMessage', icon: 'mdi-alert', text: 'mainSilderBar.debugMsg' },
  { path: '/about', icon: 'mdi-information', text: 'mainSilderBar.aboutYUKI' },
  { path: '/mygamelist', icon: 'mdi-controller', text: 'mainSilderBar.mygameList' },
  // { path: '/textscreen', icon: 'mdi-invoice-text', text: 'mainSilderBar.textScreen', }
]
// 设置
const settingBar = [
  { path: '/setting', icon: 'mdi-cog', text: 'mainSilderBar.applicationSettings', }
]
// 设置内子内容
const settingBarChildren = [
  { path: '/setting/localechanger', icon: 'mdi-map-marker', text: 'mainSilderBar.localeChanger' },
  { path: '/setting/library', icon: 'mdi-apps', text: 'mainSilderBar.applicationLibraries' },
  { path: '/setting/translator', icon: 'mdi-translate', text: 'mainSilderBar.translators' }
]
// ai翻译
const aiTranslator = []
export { sidebarLinks, settingBarChildren, settingBar, aiTranslator }
