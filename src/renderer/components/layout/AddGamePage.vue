<template>
  <YkPageHeader :yktitle="$t('mainSilderBar.addGame')"></YkPageHeader>
  <YkPageContent>
    <v-stepper v-model="activeStep" vertical class="stepper-custom" alt-labels non-linear>
      <!-- 跳转头 -->
      <v-stepper-header>
        <v-stepper-item
          :complete="activeStep > 1"
          :title="$t('AddGamePage.chooseGamePath')"
          value="1"
          step="1"
        >
        </v-stepper-item>
        <v-divider></v-divider>
        <v-stepper-item
          :complete="activeStep > 2"
          :title="$t('AddGamePage.pleaseInputSpecialCodeEmptyIfNotNeeded')"
          value="2"
          step="2"
        >
        </v-stepper-item>
      </v-stepper-header>
      <v-stepper-window>
        <!-- 步骤一 -->
        <div v-if="activeStep === 1" :step="activeStep">
          <component :class="animationClass" :is="AddGameEffectCardOne" :key="activeStep" />
          <v-btn class="nextButton" color="success" @click="handleNext">{{
            $t('AddGamePage.nextStep')
          }}</v-btn>
        </div>
        <!-- 步骤二 -->
        <div v-if="activeStep === 2" :step="activeStep">
          <component :class="animationClass" :is="AddGameEffectCardTwo" :key="activeStep" />
          <div class="AddGameBtnMangager">
            <v-btn color="secondary" @click="handlePrev">{{ $t('AddGamePage.prevStep') }}</v-btn>
            <v-btn color="primary" @click="handleNext">{{ $t('AddGamePage.finish') }}</v-btn>
          </div>
        </div>
      </v-stepper-window>
    </v-stepper>
    <v-snackbar
      v-model="showSnackSuccess"
      color="snackBar"
      :timeout="4000"
      transition="fade-transition"
    >
      <v-icon left>mdi-emoticon-wink</v-icon>
      {{ $t('AddGamePage.gameAdded') }}: {{ receiveGameName }}
      <template v-slot:actions>
        <v-btn color="primary" variant="text" @click="showSnackSuccess = false"> Close </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar
      v-model="sameSnackSuccess"
      color="sameSncakBar"
      :timeout="4000"
      transition="fade-transition"
    >
      <v-icon left>mdi-emoticon-cry</v-icon>
      {{ $t('AddGamePage.hasSameGame') }}: {{ receiveGameName }}
      <template v-slot:actions>
        <v-btn color="primary" variant="text" @click="sameSnackSuccess = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </YkPageContent>
</template>

<script setup lang="ts">
import { YkPageHeader, YkPageContent } from '.'
import { AddGameEffectCardOne, AddGameEffectCardTwo } from '../dynamicLayout'
import { ref, computed, watch, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue'
import { configStore } from '@/renderer/store/config'
import IpcTypes from '@/common/IpcTypes'
import * as _ from 'lodash'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const useConfigStore = configStore()
const showSnackSuccess = ref(false)
const sameSnackSuccess = ref(false)
const receiveGameName = ref('')
const instance = getCurrentInstance()
const vuetify3_dialog = instance?.appContext.config.globalProperties.$dialog
// 控制v-stepper的值
const activeStep = ref(1)
// 控制类名
const animationClass = ref('')
// 监听 activeStep 的变化，以便知道是向前还是向后
watch(activeStep, (newVal, oldVal) => {
  const animationDirection = newVal > oldVal ? 'animate__slideInRight' : 'animate__slideInLeft'
  animationClass.value = `animate__animated ${animationDirection}`
  // 动画完成后清除类名，准备下一次动画
  setTimeout(() => {
    animationClass.value = ''
  }, 300) // 300ms 是动画的持续时间
})
const isNullGame = () => {
  vuetify3_dialog?.error({
    title: t('AddGamePage.nullGamePath'),
    text: t('AddGamePage.pleaseAddGamePath')
  })
}
// 判断名字和路径是否为空
const isNameOrPathNull = computed(() => useConfigStore.isGameInfoEmpty)
const handleNext = () => {
  if (activeStep.value < 2) {
    activeStep.value++
  } else {
    try {
      const gameToSend = _.cloneDeep(useConfigStore.game)
      if (!isNameOrPathNull.value) {
        window.mainApi.requestAddGame(gameToSend)
      } else {
        isNullGame()
      }
      // 清空数据
      useConfigStore.resetGame()
      activeStep.value = 1 // 重置步骤
    } catch (e) {
      console.log(e)
    }
  }
}
const handlePrev = () => {
  activeStep.value--
}
const whetherReceiveGame = (event: any, newGame: yuki.Game) => {
  showSnackSuccess.value = true
  receiveGameName.value = newGame.name
}
const hasSameGame = (event: any, newGame: yuki.Game) => {
  sameSnackSuccess.value = true
  receiveGameName.value = newGame.name
}
onMounted(() => {
  window.mainApi.on(IpcTypes.HAS_ADDED_GAME, whetherReceiveGame)
  window.mainApi.on(IpcTypes.GAME_ALREADY_EXISTS, hasSameGame)
})
onBeforeUnmount(() => {
  window.mainApi.off(IpcTypes.HAS_ADDED_GAME, whetherReceiveGame)
  window.mainApi.off(IpcTypes.GAME_ALREADY_EXISTS, hasSameGame)
})
</script>

<style scoped>
.stepper-custom {
  width: 100%;
  height: 100%;
}

.nextButton {
  margin-left: 24px;
}

.AddGameBtnMangager {
  display: flex;
  margin: 0 24px;
  justify-content: space-between;
}
</style>
