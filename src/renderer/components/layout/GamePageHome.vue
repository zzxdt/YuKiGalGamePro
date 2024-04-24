<template>
  <YkPageHeader :yktitle="$t('mainSilderBar.myGames')"></YkPageHeader>
  <YkPageContent>
    <v-toolbar small class="custom-toolbar" dense color="toolbar" :extension-height="30">
      <v-spacer></v-spacer>
      <!-- 打开进程摁扭 -->
      <v-btn small dark @click="startFromProcess">{{ $t('GamesPage.startFromProcess') }}</v-btn>
    </v-toolbar>
    <!-- 弹出框dialog -->
    <v-dialog v-model="showDialog" :overlay="false" max-width="640px" transition="dialog-transition">
      <v-card>
        <v-card-title primary-title>
          <span class="custom-text">{{ $t('GamesPage.startFromProcess') }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-xs>
            <v-autocomplete variant="underlined" :items="GuiStore.getProcessesWithText()"
              :label="$t('mainSilderBar.selectProcess')" v-model="selectedProcess" item-value="pid" item-title="text"
              return-object>
            </v-autocomplete>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" @click="closeDialog">{{
    $t('mainSilderBar.cancel')
  }}</v-btn>
              <v-btn color="blue darken-1" @click="startGame">{{ $t('GamesPage.start') }}</v-btn>
            </v-card-actions>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </YkPageContent>
</template>
<script lang="ts" setup>
import { YkPageHeader, YkPageContent } from '.'
import { ref, watch, onMounted } from 'vue'
import { guiStore } from '../../store/gui'
import IpcTypes from '@/common/IpcTypes'
// file location come from store config.ts
// file location come from store gui.ts
const GuiStore = guiStore()
const showLoaders = ref(false)
const showDialog = ref(false)
const selectedProcess = ref({ name: '', pid: -1, text: '' })
onMounted(() => {
  // 判断GuiStore.processes是否为空，为空则发送HAS_RUNNING_GAME事件
  if (!GuiStore.processes) {
    window.mainApi.on(IpcTypes.HAS_RUNNING_GAME, () => {
      GuiStore.setGameStartingEnded(true)
    })
  }
})
watch(
  () => GuiStore.processes,
  (newVal, oldVal) => {
    onProcessesUpdate()
  }
)
// 从进程开始摁扭，启动进程
const startFromProcess = () => {
  window.mainApi.requestProcess()
  showDialog.value = true
}
const closeDialog = () => {
  showDialog.value = false
  selectedProcess.value.name = ''
  selectedProcess.value.pid = -1
  selectedProcess.value.text = ''
  GuiStore.setProcesses([])
}
const startGame = () => {
  const cloneProcess = {
    ...selectedProcess.value
  }
  window.mainApi.requestRunGame(undefined, cloneProcess)
  closeDialog()
}
const onProcessesUpdate = () => {
  if (GuiStore.processes.length !== 0 && showLoaders.value === true) {
    showDialog.value = true
    showLoaders.value = false
  }
}
</script>
<style scoped>
.custom-toolbar {
  width: 90vw;
  margin-top: 20px;
  border-radius: 6px;
  max-width: 100%;  height: 60px;
}

.v-btn {
  min-height: 22px;
  font-size: 0.8rem;
}
.custom-text{
  height: 20px;
}
</style>
