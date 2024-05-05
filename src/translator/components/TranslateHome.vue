<template>
  <div class="tranHome">
    <translator-title-bar :show="showNavigation"></translator-title-bar>
    <v-main class="router-view-transparent">
      <router-view></router-view>
    </v-main>
    <v-container @mouseenter="showNav" @mouseleave="hideNav">
      <v-bottom-navigation
        grow
        height="25"
        :class="{
          animate__animated: true,
          animate__fadeIn: showNavigation,
          animate__fadeOut: !showNavigation
        }"
      >
        <v-btn small text dark to="/translate">
          <!-- <v-icon>mdi-translate</v-icon> -->
          <span>{{ $t('mainSilderBar.translate') }}</span>
        </v-btn>
        <v-btn small text dark to="/hook">
          <!-- <v-icon>mdi-hook</v-icon> -->
          <span>{{ $t('mainSilderBar.textHookSettings') }}</span>
        </v-btn>
        <v-btn small text dark to="/setting">
          <!-- <v-icon>mdi-cog</v-icon> -->
          <span>{{ $t('mainSilderBar.translatorSettings') }}</span>
        </v-btn>
      </v-bottom-navigation>
    </v-container>
  </div>
</template>
<script setup>
import { TranslatorTitleBar } from '.'
import { debounce } from 'lodash'
import { useRouter } from 'vue-router'
import { ref, computed, watch } from 'vue'
import { TranslatorConfigStore } from '../store/module/Config'
const useTranslatorConfigStore = TranslatorConfigStore()
const showNavigation = ref(false)
const bounds = computed(() => useTranslatorConfigStore.getbounds)
const windowsSize = computed(() => useTranslatorConfigStore.getSize)
const router = useRouter()
const resizeWindow = (width, height) => {
  if (width && height) {
    window.mainApi.resizeWindow(width, height)
  } else {
    console.error('Invalid dimensions provided for window resize:', width, height)
  }
}
watch(
  () => bounds,
  (newBounds) => {
    if (newBounds) {
      const currentPath = router.currentRoute.value.path
      useTranslatorConfigStore.updateRouteSize(currentPath)
    }
  },
  {
    immediate: true,
    deep: true
  }
)
// 显示导航栏
const showNav = () => {
  showNavigation.value = true
}
// 隐藏导航栏
const hideNav = debounce(() => {
  showNavigation.value = false
}, 5000)

let adjustingSize = false
router.beforeEach((to, from, next) => {
  adjustingSize = true
  next()
})
router.afterEach((to, from) => {
  const newPathBounds = windowsSize.value[to.path]
  if (newPathBounds) {
    const { width, height } = bounds.value
    if (width !== newPathBounds.width || height !== newPathBounds.height) {
      resizeWindow(newPathBounds.width, newPathBounds.height)
    }
    setTimeout(() => {
      if (adjustingSize) {
        useTranslatorConfigStore.updateRouteSize(to.path)
        adjustingSize = false
      }
    }, 300)
  }
})
</script>
<style scoped>
.router-view-transparent {
  width: 100%;
  background-color: transparent;
}

.tranHome {
  width: 100%;
  height: 100%;
}
</style>
