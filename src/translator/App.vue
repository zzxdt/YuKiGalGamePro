<template>
  <v-app app class="vapp" :style="updataBackGroundColor">
    <TranslateHome></TranslateHome>
  </v-app>
</template>

<script setup>
import { TranslateHome } from './components'
import { TranslatorConfigStore } from './store/module/Config'
import { onMounted, computed, onBeforeUnmount } from 'vue'
import { configIpcService } from './translatorIpcServer/configIpcService'
const useTranslatorConfigStore = TranslatorConfigStore()
const updataBackGroundColor = computed(() => {
  const style = useTranslatorConfigStore.getbackgroundColor
  if (style) {
    return {
      backgroundColor: style
    }
  } else {
    return {
      backgroundColor: 'rgba(0, 0, 0, 0.3)'
    }
  }
})
onMounted(() => {
  configIpcService.init()
})
onBeforeUnmount(() => {
  configIpcService.unregisterEventListeners()
})
</script>
<style scoped>
.vapp {
  margin: 0;
}
</style>
