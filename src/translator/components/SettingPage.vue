<template>
  <div>
    <v-container class="settingPage">
      <v-row no-gutters align="center">
        <v-col cols="3">
          <div class="text-center">{{ $t('TranslatorSettingsPage.originalText') }}</div>
        </v-col>
        <v-col>
          <p style="color: white">{{ $t('TranslatorSettingsPage.size') }}</p>
          <v-slider
            step="0.1"
            :thumb-label="originalTextThumbLabel"
            min="0.1"
            max="2"
            v-model="originalTextSize"
          ></v-slider>
        </v-col>
        <v-col>
          <div class="switch-container">
            <v-switch v-model="originalTextVisiable" color="info"></v-switch>
            <p class="label">原文 {{ originalTextVisiable ? '已开启' : '已关闭' }}</p>
          </div>
        </v-col>
      </v-row>
      <v-row no-gutters align="center">
        <v-col cols="3">
          <div class="text-center">{{ $t('TranslatorSettingsPage.translatedText') }}</div>
        </v-col>
        <v-col>
          <p style="color: white">{{ $t('TranslatorSettingsPage.size') }}</p>
          <v-slider
            step="0.1"
            :thumb-label="translationTextThumbLabel"
            min="0.1"
            max="2"
            v-model="translationTextSize"
          ></v-slider>
        </v-col>
        <v-col>
          <p style="color: white">{{ $t('TranslatorSettingsPage.margin') }}</p>
          <v-slider
            step="0.1"
            class="margin-top"
            :thumb-label="translationTextMarginThumbLabel"
            min="0.1"
            max="2"
            v-model="translationTextMargin"
          ></v-slider>
        </v-col>
      </v-row>
      <v-row no-gutters align="center">
        <v-col cols="3">
          <div class="text-center">{{ $t('TranslatorSettingsPage.mecabText') }}</div>
        </v-col>
        <v-col>
          <p style="color: white">{{ $t('TranslatorSettingsPage.mecabSize') }}</p>
          <v-slider
            step="0.1"
            :thumb-label="mecabTextThumbLabel"
            min="0.1"
            max="2"
            v-model="mecabTextSize"
          ></v-slider>
        </v-col>
        <v-col>
          <p style="color: white">{{ $t('TranslatorSettingsPage.mecabFontPadding') }}</p>
          <v-slider
            step="0.1"
            :thumb-label="mecabFontPaddingThumbLabel"
            min="0.1"
            max="2"
            v-model="mecabFontPadding"
          ></v-slider>
        </v-col>
      </v-row>
      <v-row no-gutters align="center">
        <v-col cols="3">
          <div class="text-center">{{ $t('TranslatorSettingsPage.mecabReading') }}</div>
        </v-col>
        <v-col>
          <p style="color: white">{{ $t('TranslatorSettingsPage.mecabReadingText') }}</p>
          <v-slider
            step="0.1"
            :thumb-label="mecabReadingThumbLabel"
            min="0.1"
            max="2"
            v-model="mecabReadingSize"
          ></v-slider>
        </v-col>
      </v-row>
      <v-row class="margin-top">
        <v-col cols="3">
          <div class="text-center">{{ $t('TranslatorSettingsPage.backgroundColor') }}</div>
        </v-col>
        <v-col>
          <v-color-picker v-model="currentColor" rounded="2"></v-color-picker>
        </v-col>
      </v-row>
      <v-row class="margin-top">
        <v-col cols="3">
          <div class="text-center">{{ $t('TranslatorSettings.originalTextColor') }}</div>
        </v-col>
        <v-col>
          <v-color-picker v-model="originalTextColor" rounded="2"></v-color-picker>
        </v-col>
      </v-row>
      <v-row class="margin-top">
        <v-col cols="3">
          <div class="text-center">{{ $t('TranslatorSettings.translatorTextColor') }}</div>
        </v-col>
        <v-col>
          <v-color-picker v-model="translatorTextColor" rounded="2"></v-color-picker>
        </v-col>
      </v-row>
      <v-row class="margin-top">
        <v-col class="d-flex justify-center">
          <v-btn color="primary" @click="toggleDevTools">{{
            $t('mainSilderBar.toggleDevTools')
          }}</v-btn>
        </v-col>
        <v-col class="d-flex justify-center">
          <v-btn color="success" @click="settingAchieve">{{
            $t('TranslatorSettings.settingAchieve')
          }}</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { TranslatorConfigStore } from '../store/module/Config'
import { TranslatorViewStore } from '../store/module/View'
import { computed, getCurrentInstance } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const instance = getCurrentInstance()
const vuetify3_dialog = instance?.appContext.config.globalProperties.$dialog
const useTranslatorConfigStore = TranslatorConfigStore()
const useTranslatorViewStore = TranslatorViewStore()
const saveSuccess = () => {
  vuetify3_dialog?.success({
    text: t('TranslatorSettings.saveSuccess')
  })
}
const originalTextVisiable = computed({
  get: () => useTranslatorViewStore.originalTextVisiable,
  set: (value) => useTranslatorViewStore.setOriginalTextVisiable(value)
})
const originalTextColor = computed({
  get: () => useTranslatorConfigStore.getOriginalText.color,
  set: (value) => useTranslatorConfigStore.setOriginalTextColor({ color: value })
})
const translatorTextColor = computed({
  get: () => useTranslatorConfigStore.getTranslationText.color,
  set: (value) => useTranslatorConfigStore.setTranslationTextColor({ color: value })
})
const originalTextSize = computed({
  get: () => useTranslatorConfigStore.getOriginalText.fontSize,
  set: (value) => useTranslatorConfigStore.setOriginalTextSize({ size: value })
})
const translationTextSize = computed({
  get: () => useTranslatorConfigStore.getTranslationText.fontSize,
  set: (value) => useTranslatorConfigStore.setTranslationTextSize({ size: value })
})
const translationTextMargin = computed({
  get: () => useTranslatorConfigStore.getTranslationText.margin,
  set: (value) => useTranslatorConfigStore.setTranslationTextMargin({ margin: value })
})
const currentColor = computed({
  get: () => useTranslatorConfigStore.getbackgroundColor,
  set: (value) => useTranslatorConfigStore.setbackgroundColor({ color: value })
})
const mecabTextSize = computed({
  get: () => useTranslatorConfigStore.getMecabText.fontSize,
  set: (value) => useTranslatorConfigStore.setMecabTextSize({ size: value })
})
const mecabFontPadding = computed({
  get: () => useTranslatorConfigStore.getMecabText.fontPadding,
  set: (value) => useTranslatorConfigStore.setMecabFontPadding({ padding: value })
})
const mecabReadingSize = computed({
  get: () => useTranslatorConfigStore.getMecabReading.fontSize,
  set: (value) => useTranslatorConfigStore.setMecaReadingSize({ padding: value })
})
const originalTextThumbLabel = computed(() => {
  return useTranslatorConfigStore.translatorWindow.originalText.fontSize !== 0.1 ? 'always' : false
})
const translationTextThumbLabel = computed(() => {
  return useTranslatorConfigStore.translatorWindow.translationText.fontSize !== 0.1
    ? 'always'
    : false
})
const translationTextMarginThumbLabel = computed(() => {
  return useTranslatorConfigStore.translatorWindow.translationText.margin !== 0.1 ? 'always' : false
})
const mecabTextThumbLabel = computed(() => {
  return useTranslatorConfigStore.translatorWindow.mecabText.fontSize !== 0.1 ? 'always' : false
})
const mecabFontPaddingThumbLabel = computed(() => {
  return useTranslatorConfigStore.translatorWindow.mecabText.fontPadding !== 0.1 ? 'always' : false
})
const mecabReadingThumbLabel = computed(() => {
  return useTranslatorConfigStore.translatorWindow.mecabText.fontSize !== 0.1 ? 'always' : false
})
const toggleDevTools = () => {
  window.mainApi.toggleDevTools()
}
const settingAchieve = () => {
  useTranslatorConfigStore.saveConfig()
  saveSuccess()
  useTranslatorViewStore.setIsSaveConfig(true)
}
</script>

<style scoped>
.settingPage {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
.label {
  margin-top: 0;
  color: whitesmoke;
}
.switch-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.text-center {
  font-size: 1.1em;
  color: white;
}
</style>
