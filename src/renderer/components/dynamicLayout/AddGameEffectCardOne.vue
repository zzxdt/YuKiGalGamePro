<template>
  <v-card flat class="cardOne">
    <br />
    <v-btn variant="tonal" @click="requestGamePath">
      {{ $t('AddGamePage.chooseGamePath') }}
    </v-btn>
    <br />
    <br />
    <v-text-field
      :label="$t('AddGamePage.gameName')"
      prepend-icon="mdi-gamepad-square"
      variant="underlined"
      v-model="useConfigStore.game.name"
    ></v-text-field>
    <br />
    <p>{{ $t('AddGamePage.gamePath') }}</p>
    <v-textarea
      disabled
      rows="1"
      auto-grow
      variant="underlined"
      prepend-icon="mdi-folder"
      v-model="useConfigStore.game.path"
    ></v-textarea>
  </v-card>
</template>

<script setup lang="ts">
import IpcTypes from '@/common/IpcTypes'
import { configStore } from '@/renderer/store/config'
import { onMounted } from 'vue'
const useConfigStore = configStore()
const requestGamePath = () => {
  window.mainApi.requestNewGamePath()
}
const receiveGamePath = (event: any, gamePath: string) => {
  useConfigStore.setGamePath(gamePath)
}
onMounted(() => {
  window.mainApi.once(IpcTypes.HAS_NEW_GAME_PATH, receiveGamePath)
})
</script>

<style scoped>
.cardOne {
  margin: 24px;
}
</style>
