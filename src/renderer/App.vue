<template>
  <v-app class="mainScreen">
    <AppSilderBarVue></AppSilderBarVue>
  </v-app>
</template>
<script setup lang="tsx">
import { AppSilderBarVue } from '@/renderer/components/layout'
import { onMounted, onBeforeUnmount } from 'vue'
import { configIpcService } from '@/ipcServer/configIpcService'
onMounted(() => {
  // 处理pinia中的store 通过ipc获取到的数据存放到pinia中 存放在/src/ipcServer中
  configIpcService.init()
})
onBeforeUnmount(() => {
  configIpcService.unregisterEventListeners()
})
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  width: 100vw;
  height: 100vh;
}

.mainScreen {
  width: 100%;
  height: 100%;
}
</style>
