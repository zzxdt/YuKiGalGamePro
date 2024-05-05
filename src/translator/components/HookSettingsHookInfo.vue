<template>
  <div>
    <v-scroll-y-transition :appear="true">
      <v-card class="hook-info">
        <v-container grid-list-xs>
          <v-row justify="center" wrap="wrap">
            <v-col sm="12" md="12" lg="4" align="center" align-self="center">
              <v-list-item align="center">
                <v-list-item>
                  <v-list-item-title>{{ hookinfo.hook?.handle }}</v-list-item-title>
                  <v-list-item-title>{{ hookinfo.hook?.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ hookinfo.hook?.code }}</v-list-item-subtitle>
                </v-list-item>
              </v-list-item>
            </v-col>
            <v-col>
              <v-row>
                <v-col sm="12" md="8" lg="6" align="center" align-self="center">
                  <v-text-field
                    readonly
                    dense
                    persistent-hint
                    counter
                    variant="underlined"
                    :hint="$t('TranslatorTextInfo.lastText')"
                    :placeholder="$t('TranslatorTextInfo.waitForTexts')"
                    v-model="hook.text"
                  />
                </v-col>
                <v-col sm="12" md="4" lg="2" align="center" align-self="center">
                  <v-btn rounded color="success" dark to="/translate" @click="chooseAsDisplay">
                    {{ $t('TranslatorTextInfo.choose') }}
                    <v-icon dark right>mdi-check</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-scroll-y-transition>
  </div>
</template>
<script setup>
import { TranslatorHookStore } from '../store/module/Hook'
const useTranslatorHookStore = TranslatorHookStore()
import { defineProps } from 'vue'
const hookinfo = defineProps({
  hook: Object
})
const chooseAsDisplay = () => {
  const choseHandle = hookinfo.hook?.handle
  // 将选中handle传递给 store
  useTranslatorHookStore.setCurrentHandle(choseHandle)
}
</script>

<style scoped>
.hook-info {
  margin: 20px auto;
}
</style>
