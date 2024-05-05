<template>
  <div>
    <YkPageHeader :yktitle="$t('mainSilderBar.mygameList')"></YkPageHeader>
    <v-container>
      <v-row>
        <v-col sm="12" md="6" lg="4" v-for="game in games" :key="game.path">
          <v-scroll-y-transition>
            <YkGamePageGameCard :game="game"></YkGamePageGameCard>
          </v-scroll-y-transition>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { YkPageHeader, YkGamePageGameCard } from '.'
import { configStore } from '@/renderer/store/config'
import { computed } from 'vue'
const useConfig = configStore()
const games = computed(() => {
  return useConfig.games
})
</script>

<style scoped></style>
