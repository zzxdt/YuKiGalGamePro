<template>
  <v-card class="cardTwo" flat>
    <!-- 步骤 2 的内容 -->
    <p>{{ $t('AddGamePage.pleaseInputSpecialCodeEmptyIfNotNeeded') }}</p>
    <br />
    <br />
    <v-text-field :label="$t('AddGamePage.specialCode')" variant="underlined" prepend-icon="mdi-code-tags"
      v-model="specialCode"></v-text-field>
  </v-card>
</template>

<script setup>
import { configStore } from '@/renderer/store/config';
import { ref, watch } from 'vue'
const useConfigStore = configStore()
const specialCode = ref('')
watch((specialCode), (newValue) => {
  useConfigStore.setGameCode(newValue)
}, {
  immediate: true
})
</script>

<style scoped>
.cardTwo {
  margin: 24px;
}
</style>
