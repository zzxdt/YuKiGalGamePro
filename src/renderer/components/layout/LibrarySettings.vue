<template>
  <div>
    <YkPageHeader :yktitle="$t('LibrarySettings.dataLibrary')"></YkPageHeader>
    <v-lazy>
      <YkPageContent>
        <v-container grid-list-xs>
          <v-row>
            <v-icon size="large" :color="getRedisStatus ? 'success' : 'error'">mdi-database-cog-outline</v-icon>
          </v-row>
          <v-row>
            <v-col sm="12" md="4" lg="4" class="d-flex align-center justify-center">
              <span class="host">
                <p class="local">{{ $t('LibrarySettings.localHost') }}</p>
                :<p class="port">{{ host }}</p>
              </span>
            </v-col>
            <v-col sm="12" md="8" lg="8">
              <v-text-field v-model="search" name="redis" :label="$t('LibrarySettings.search')" density="compact" flat
                hide-details single-line :hint="$t('LibrarySettings.inputWord')" prepend-inner-icon="mdi-magnify"
                variant="solo-filled"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col sm="12" md="4" lg="3" class="d-flex align-center justify-center">
              <v-btn color="success" @click="getAllwordFromRedis">{{ $t('LibrarySettings.checkAllWord') }}</v-btn>
            </v-col>
            <v-col sm="12" md="4" lg="3" class="d-flex align-center justify-center">
              <v-btn color="error" @click="showDeletAllDialog">{{ $t('LibrarySettings.deleteAllWord') }}</v-btn>
            </v-col>
            <v-col sm="12" md="4" lg="3" class="d-flex align-center justify-center">
              <v-btn color="warning" @click="showQuitDialog">{{ $t('LibrarySettings.quit') }}</v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-data-table :headers="headers" :items-per-page="5" class="elevation-1" :items="useRedisStore.wordInfo"
              :search="search">
              <template v-slot:item="{ item }">
                <tr>
                  <td>{{ item.key }}</td>
                  <td>{{ item.value.translation }}</td>
                  <td><a :href="item.value.audioUrl" target="_blank">Link</a></td>
                  <td>{{ item.value.reading }}</td>
                  <td>{{ item.value.romaji }}</td>
                </tr>
              </template>
            </v-data-table>
          </v-row>
        </v-container>
      </YkPageContent>
    </v-lazy>
    <v-dialog v-model="deleteAllDialog" width="400px" transition="dialog-transition">
      <v-card>
        <v-card-title class="d-flex justify-center pa-4">{{ $t('LibrarySettings.deleteAllWord') }}</v-card-title>
        <v-card-subtitle class="d-flex justify-center pa-2">{{ $t('LibrarySettings.sureDeleteAll') }}</v-card-subtitle>
        <v-card-actions class="d-flex justify-space-around pa-4">
          <v-btn color="error" @click="confirmDeletion">{{ $t('LibrarySettings.sure') }}</v-btn>
          <v-btn color="info" @click="cancelDelete">{{ $t('LibrarySettings.cancel') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="quitDialog" width="400px" transition="dialog-transition">
      <v-card>
        <v-card-title class="d-flex justify-center pa-4">{{ $t('LibrarySettings.quit') }}</v-card-title>
        <v-card-subtitle class="d-flex justify-center pa-2">{{ $t('LibrarySettings.sureQuit') }}</v-card-subtitle>
        <v-card-actions class="d-flex justify-space-around pa-4">
          <v-btn color="error" @click="confirmQuit">{{ $t('LibrarySettings.sure') }}</v-btn>
          <v-btn color="info" @click="cancelQuit">{{ $t('LibrarySettings.cancel') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { YkPageHeader, YkPageContent } from '.';
import IpcTypes from '@/common/IpcTypes';
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { redisStore } from '@/renderer/store/controlRedis'
const useRedisStore = redisStore()
const host = ref("127.0.0.1:6379")
const search = ref('')
//定义数据表格头部
const headers = [
  { title: 'Word', value: 'value.orininalText' },
  { title: 'Translation', value: 'value.translation' },
  { title: 'Audio URL', value: 'value.audioUrl' },
  { title: 'reading', value: 'value.reading' },
  { title: 'romaji', value: 'value.romaji' }
];
const getRedisStatus = computed(() => useRedisStore.getRedisStart)
const deleteAllDialog = ref(false)
const quitDialog = ref(false)
const getAllwordFromRedis = () => {
  useRedisStore.loadAllWordInfo()
}
const showDeletAllDialog = () => {
  deleteAllDialog.value = true
}

const showQuitDialog = () => {
  quitDialog.value = true
}
const cancelDelete = () => {
  deleteAllDialog.value = false
}
const cancelQuit = () => {
  quitDialog.value = false
}
const confirmDeletion = () => {
  useRedisStore.deleteAllWordInRedis()
  deleteAllDialog.value = false
}
const confirmQuit = () => {
  useRedisStore.quitRedis()
  quitDialog.value = false
}
const receiveAllWordFromRedis = (event: any, redisAllword: any) => {
  useRedisStore.setWordInfo(redisAllword)
}
const deleteAllWordFromRedis = (event: any, deleteAllWord: any) => {
  useRedisStore.setDeleteAllWordInRedis(deleteAllWord)
}
const checkRedisIsStart = (event: any, status: boolean) => {
  useRedisStore.setRedisStart(status)
}
onMounted(() => {
  window.mainApi.on(IpcTypes.CURRENT_REDIS_STATUS, checkRedisIsStart)
  window.mainApi.on(IpcTypes.HAS_ALL_WORD_FROM_REDIS, receiveAllWordFromRedis)
  window.mainApi.on(IpcTypes.HAS_DELETE_ALL_FROM_REDIS, deleteAllWordFromRedis)
})
onBeforeUnmount(() => {
  window.mainApi.off(IpcTypes.CURRENT_REDIS_STATUS, checkRedisIsStart)
  window.mainApi.off(IpcTypes.HAS_ALL_WORD_FROM_REDIS, receiveAllWordFromRedis)
  window.mainApi.off(IpcTypes.HAS_DELETE_ALL_FROM_REDIS, deleteAllWordFromRedis)
})
</script>

<style scoped>
p {
  display: inline-block;
  transition: all 0.3s ease;
}

.local:hover {
  color: #fff;
  /* 文本颜色 */
  filter: drop-shadow(0 0 5px #C8E6C9) drop-shadow(0 0 10px #A5D6A7);
}

.port:hover {
  color: #fff;
  filter: drop-shadow(0 0 5px #B3E5FC) drop-shadow(0 0 10px #4FC3F7);
}
</style>
