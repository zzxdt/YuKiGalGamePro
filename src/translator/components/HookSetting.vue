<template>
  <div>
    <v-container grid-list-xs class="scroll-container">
      <div class="btnManager">
        <v-btn @click="showDialog" type="primary">{{
          $t('TranslatorHookerSetting.addHook')
        }}</v-btn>
      </div>
      <v-dialog v-model="openInputHook" max-width="500px">
        <v-card>
          <v-card-title>
            <span>{{ $t('mainSilderBar.inputSpecialCode') }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-text-field
                v-model="hookCode"
                :error-messages="errorText"
                :label="$t('mainSilderBar.specialCode')"
                variant="underlined"
              ></v-text-field>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="closeInputHookDialog">{{
              $t('mainSilderBar.cancel')
            }}</v-btn>
            <v-btn color="primary" text @click="addHook">{{ $t('mainSilderBar.ok') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <div v-for="[handle, infos] in hookinfos" :key="handle">
        <TranslatorHookInfo
          v-for="(info, index) in infos"
          :key="index"
          :hook="info"
        ></TranslatorHookInfo>
      </div>
    </v-container>
  </div>
</template>

<script setup>
import { TranslatorHookInfo } from '.'
import { ref, computed } from 'vue'
import { TranslatorHookStore } from '@/translator/store/module/Hook'
const useTranslatorHookStore = TranslatorHookStore()
const openInputHook = ref(false)
const hookCode = ref('')
const errorText = ref('')
const hookinfos = computed(() => {
  return Object.entries(useTranslatorHookStore.hookinfos)
})
// 添加hook
const addHook = () => {
  if (new RegExp(/\/H\w+/).test(hookCode.value)) {
    window.mainApi.requestInsertHooks(hookCode.value)
    closeInputHookDialog()
  }
}
// 显示输入hook对话框
const showDialog = () => {
  openInputHook.value = true
}
// 关闭输入hook对话框
const closeInputHookDialog = () => {
  openInputHook.value = false
}
</script>

<style scoped>
.scroll-container {
  margin: 10px auto;
}

.btnManager {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
</style>
