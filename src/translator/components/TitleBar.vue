<template>
  <div class="titleBar">
    <v-app-bar app color="primary" density="compact" id="app-bar-center" height="45"
      :class="{ 'animate__animated': true, 'animate__fadeIn': show, 'animate__fadeOut': !show }">
      <div class="buttonManager">
        <v-btn @click="pauseTraText" :icon="puaseTranslationText ? 'mdi-play' : 'mdi-pause'" color="tertiary">
        </v-btn>
        <v-btn @click="toggleAlwaysOnTop" color="tertiary"
          :icon="isAlwaysOnTop ? 'mdi-lock' : 'mdi-lock-open-outline'"></v-btn>
        <v-btn color="tertiary" @click="saveConfig"
          :icon="IsSaveConfig ? 'mdi-content-save-check' : 'mdi-content-save'"></v-btn>
        <v-btn color="tertiary" @click="closeWindows" icon="mdi-close">
        </v-btn>
      </div>
    </v-app-bar>
  </div>
</template>

<script setup>
import { onMounted, ref, defineProps, computed, onBeforeUnmount, watch } from 'vue';
import { TranslatorViewStore } from '../store/module/View';
import { TranslatorConfigStore } from '../store/module/Config';
import IpcTypes from '@/common/IpcTypes';
defineProps({
  show: Boolean,
});
const useTranslatorConfigStore = TranslatorConfigStore()
const useTranslatorViewStore = TranslatorViewStore();
const isHideWindowValid = ref(true);
const puaseTranslationText = computed(() => {
  return useTranslatorViewStore.getPauseTranslation
})
const IsSaveConfig = computed(() => {
  return useTranslatorViewStore.getIsSaveConfig
})
const isAlwaysOnTop = computed(() => {
  return useTranslatorViewStore.getIsAlwaysOnTop
})
const toggleAlwaysOnTop = () => {
  window.mainApi.toggleAlwaysOnTop()
}
const closeWindows = () => {
  window.mainApi.hideTranslateWindows()
}
const saveConfig = () => {
  useTranslatorConfigStore.saveConfig()
  useTranslatorViewStore.setIsSaveConfig(true)
}
const pauseTraText = () => {
  useTranslatorViewStore.setPauseTranslation()
}
const alwaysOnTopChange = (event, topStatus) => {
  useTranslatorViewStore.setIsAlwaysOnTop(topStatus)
}

onMounted(() => {
  window.mainApi.on(IpcTypes.ALWAYS_ON_TOP_CHANGED, alwaysOnTopChange)
})
onBeforeUnmount(() => {
  window.mainApi.off(IpcTypes.ALWAYS_ON_TOP_CHANGED, alwaysOnTopChange)
})
</script>

<style scoped>
.titleBar {
  position: relative;
  width: 100%;

}

.titleBar:hover {
  cursor: pointer;
}

#app-bar-center {
  -webkit-app-region: drag;
}

.buttonManager {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* 使用transform进行微调，确保完全居中 */
  display: flex;
  justify-content: center;
  align-items: center;
  -webkit-app-region: no-drag;
}
</style>