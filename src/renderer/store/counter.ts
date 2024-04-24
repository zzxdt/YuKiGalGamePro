import { defineStore } from 'pinia'
const usedrawerStore = defineStore('drawer', {
  state: () => ({
    // silderBar宽度设置
    width: 256, // 展开时的宽度
    railWidth: 56, // 收缩时的宽度
    drawerExpanded: true, // 是否展开
    headerHeight: 64,
    controlLightOrDark: true //控制白天黑夜模式切换的开关
  }),
  getters: {
    drawerWidth: (state): string => {
      return state.drawerExpanded ? `${state.width - state.railWidth + 30}px` : '0px'
    },
    silerBarHeight: (state): string => {
      return `${state.headerHeight}px`
    },
    toolHeader: (state): string => {
      return state.drawerExpanded ? `${state.width - state.railWidth + 20}px` : '20px'
    },
    setFromPocessWidth: (state): string => {
      return state.drawerExpanded ? '70vw' : '96vw'
    }
  },
  actions: {
    toggleDrawer() {
      this.drawerExpanded = !this.drawerExpanded
    },
    toggleLightOrDark() {
      this.controlLightOrDark = !this.controlLightOrDark
    }
  }
})
export { usedrawerStore }
