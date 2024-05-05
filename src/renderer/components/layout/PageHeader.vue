<!-- 游戏首界面头部 -->
<template>
  <v-app-bar app color="primary" dark class="app-header" height="68" fixed>
    <v-toolbar-title>{{ yktitle }}</v-toolbar-title>
    <!-- 标题 -->
    <v-btn icon class="manipulate-button" @click="minimizeWindow">
      <v-icon>mdi-minus</v-icon>
    </v-btn>
    <v-btn icon class="manipulate-button" @click="closeWindow">
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <!-- 缩小和关闭摁扭 -->
  </v-app-bar>
</template>
<script lang="tsx" name="PageHeader">
import { usedrawerStore } from '../../store/counter'
import { defineComponent, PropType } from 'vue'
export default defineComponent({
  props: {
    yktitle: {
      type: String as PropType<string>,
      require: true
    }
  },
  setup() {
    const minimizeWindow = () => {
      window.mainApi.minimizeApp()
    }

    const closeWindow = () => {
      window.mainApi.closeApp()
    }
    const drawerStore = usedrawerStore()
    return {
      minimizeWindow,
      closeWindow,
      drawerWidth: drawerStore.drawerWidth,
      drawerStore
    }
  }
})
</script>
<style scoped>
.app-header {
  display: block;
  width: 100%;
  margin: 0;
  padding: 0;
  -webkit-app-region: drag;
}

.manipulate-button {
  display: flex;
  justify-content: center;
  -webkit-app-region: no-drag;
}
</style>
