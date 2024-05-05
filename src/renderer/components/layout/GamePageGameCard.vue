<template>
  <v-container grid-list-xs>
    <v-card
      class="ykgameCard"
      :title="isprops.game?.name"
      :subtitle="isprops.game?.code"
      :text="isprops.game?.path"
    >
      <v-card-actions>
        <v-btn
          rounded
          color="primary"
          @click.stop="handleRunGame"
          variant="tonal"
          min-width="40%"
          density="default"
        >
          {{ $t('GamesPageGameCard.run') }}
          <v-icon right dark>mdi-play</v-icon>
        </v-btn>
        <v-btn
          rounded
          color="error"
          variant="tonal"
          min-width="40%"
          density="default"
          @click.stop="dialog = true"
        >
          {{ $t('GamesPageGameCard.delete') }}
          <v-icon right dark>mdi-delete</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn icon @click="showExpansion = !showExpansion">
          <v-icon>{{ showExpansion ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-btn>
      </v-card-actions>
      <v-expand-transition>
        <div v-show="showExpansion">
          <v-divider></v-divider>
          <v-container>
            <v-radio-group
              v-model="selectedLocaleChanger"
              :label="$t('mainSilderBar.localeChanger')"
            >
              <v-radio
                v-for="(value, key) in localeChangers"
                :key="isprops.game?.name + '-changer-' + key"
                :value="value.name"
                :label="value.name"
              ></v-radio>
            </v-radio-group>
            <v-text-field
              v-model="code"
              variant="underlined"
              :label="$t('mainSilderBar.specialCode')"
            >
            </v-text-field>
            <v-container grid-list-xs class="d-flex justify-space-around">
              <v-btn @click="save">
                {{ $t('mainSilderBar.save') }}
              </v-btn>
              <v-btn @click="openFolder">
                {{ $t('GamesPageGameCard.openFolder') }}
              </v-btn>
            </v-container>
          </v-container>
        </div>
      </v-expand-transition>
    </v-card>

    <!-- 删除对话框 -->
    <v-dialog
      v-model="dialog"
      persistent
      max-width="320px"
      color="surface"
      variables="border-opacity"
    >
      <v-card>
        <v-card-title
          color="warning"
          class="justify-center d-flex"
          v-text="$t('GamesPageGameCard.confirmDelete')"
        ></v-card-title>
        <v-card-text class="text-center">
          {{ $t('GamesPageGameCard.areYouReallySure') }}
        </v-card-text>
        <v-card-actions class="justify-space-between d-flex">
          <v-btn color="confirm" @click="handleDeleteConfirm">{{
            $t('GamesPageGameCard.sure')
          }}</v-btn>
          <v-btn color="primary" @click="dialog = false">{{
            $t('GamesPageGameCard.cancel')
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script setup lang="ts">
import { ref, watch, getCurrentInstance, computed } from 'vue'
import { guiStore } from '@/renderer/store/gui'
import { configStore } from '@/renderer/store/config'
import { PropType } from 'vue'
import * as _ from 'lodash'
import { useI18n } from 'vue-i18n'
const useConfigStore = configStore()
const useGuiStore = guiStore()
const { t } = useI18n()
const instance = getCurrentInstance()
const vuetify3_dialog = instance?.appContext.config.globalProperties.$dialog
const showLoaders = ref(false)
// 响应式属性控制 v-dialog 显示
const dialog = ref(false)
const selectedLocaleChanger = ref('')
const code = ref('')
const showExpansion = ref(false)
const isprops = defineProps({
  game: Object as PropType<yuki.Game>
})
let tranformGame = {
  ...isprops.game
} as yuki.Game
const Games = computed(() => useConfigStore.getGames)
const localeChangers = computed(() => useConfigStore.getLocalChangers)
watch(
  () => useGuiStore.isGameStartingEnded,
  (newVal) => {
    checkGameStartingEnded(newVal)
  }
)
const checkGameStartingEnded = (newVal: boolean) => {
  showLoaders.value = true
  if (newVal === true) {
    useGuiStore.setGameStartingEnded(!newVal)
  }
}
const handleDeleteConfirm = () => {
  DeleteGame()
  deleteSuccess()
  dialog.value = false
}
const DeleteGame = () => {
  window.mainApi.requestRemoveGame(tranformGame)
}
// 删除成功对话框
const deleteSuccess = () => {
  vuetify3_dialog?.success({
    title: t('GamesPageGameCard.deleteSuccess'),
    text: `${isprops.game?.name}` + t('GamesPageGameCard.hasBeenDeleted')
  })
}
const saveSuccess = () => {
  vuetify3_dialog?.success({
    title: t('GamesPageGameCard.saveSuccess'),
    text: `${isprops.game?.name}` + t('GamesPageGameCard.hasSave')
  })
}
const handleRunGame = () => {
  showLoaders.value = true
  window.mainApi.requestRunGame(tranformGame, undefined)
}
const save = () => {
  const savingConfig: yuki.Game[] = _.cloneDeep(Games.value)
  const thisGame = savingConfig.find((game) => game.name === isprops.game?.name)
  if (!thisGame) return
  for (const key in localeChangers.value) {
    if (localeChangers.value[key].name !== selectedLocaleChanger.value) {
      continue
    }
    thisGame.localeChanger = key
    thisGame.code = code.value
  }
  tranformGame = thisGame
  window.mainApi.requestSaveConfig('games', JSON.stringify(savingConfig))
  showExpansion.value = false
  saveSuccess()
}
const openFolder = () => {
  window.mainApi.openFolder(tranformGame.path)
}
</script>

<style scoped></style>
