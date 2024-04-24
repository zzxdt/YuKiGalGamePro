<template>
  <YkPageHeader :yktitle="$t('mainSilderBar.aboutYUKI')"></YkPageHeader>
  <YkPageContent style="text-align: center">
    <v-container class="AboutPage">
      <v-card class="card">
        <v-card-title>About YUKI GAL Pro</v-card-title>
        <v-divider></v-divider>
        <v-row justify="center" align="center">
          <v-col cols="4">
            <div class="switch-container">
              <v-switch v-model="redisSwitch" inset color="info"></v-switch>
              <p class="label">Redis {{ redisSwitch ? '已开启' : '已关闭' }}</p>
            </div>
          </v-col>
          <v-col cols="4">
            <div class="switch-container">
              <v-switch v-model="ankiSwitch" inset color="info"></v-switch>
              <p class="label">Anki {{ ankiSwitch ? '已开启' : '已关闭' }}
              </p>
            </div>
          </v-col>
          <v-col>
            <div class="switch-container">
              <v-switch v-model="mecabSwitch" inset color="info"></v-switch>
              <p class="label">Mecab {{ mecabSwitch ? '已开启' : '已关闭' }}
              </p>
            </div>
          </v-col>
        </v-row>
        <v-btn class="aboutn" color="success" @click="openDevTools">打开开发工具</v-btn>
      </v-card>
    </v-container>
  </YkPageContent>
</template>
<script setup lang="ts">
import { YkPageHeader, YkPageContent } from '.'
import { computed } from 'vue';
import { configStore } from '@/renderer/store/config';
const useConfigStore = configStore()
const redisSwitch = computed({
  get: () => useConfigStore.default.redis,
  set: (val) => {
    useConfigStore.default.redis = val
  }
})
const ankiSwitch = computed({
  get: () => useConfigStore.default.anki,
  set: (val) => {
    useConfigStore.default.anki = val
  }
})
const mecabSwitch = computed({
  get: () => useConfigStore.default.mecab,
  set: (val) => {
    useConfigStore.default.mecab = val
  }
})
const openDevTools = () => {
  window.mainApi.toggleDevTools()
}
</script>
<style scoped>
.full-width {
  width: 100%;
}

.switch-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 35px;
}

.AboutPage {
  height: 100%
}

.label {
  margin-top: 0
}

.aboutn {
  margin-bottom: 25px;
}
</style>
