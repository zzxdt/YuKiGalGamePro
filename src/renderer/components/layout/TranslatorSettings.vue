<template>
  <div>
    <YkPageHeader :yktitle="$t('mainSilderBar.translators')"></YkPageHeader>
    <v-container grid-list-xs class="TranslatorSetting">
      <v-row>
        <v-col sm="12" md="5" lg="4">
          <v-text-field class="text-center" variant="underlined"
            :label="$t('TranslatorSettings.currentTranslationApiType')" readonly dense
            v-model="textTranslationApi"></v-text-field>
        </v-col>
        <v-col sm="12" md="5" lg="4">
          <v-text-field class="text-center" variant="underlined" :label="$t('TranslatorSettings.currentMecabApiType')"
            readonly dense v-model="mecabTranslationApi"></v-text-field>
        </v-col>
        <v-col sm="12" md="2" lg="4">
          <v-btn color="success" @click="SureSet">{{ $t('TranslatorSettings.settingAchieve') }}</v-btn>
        </v-col>
      </v-row>
      <v-row v-for="(api, index) in onlineApis" :key="index">
        <v-col cols="12">
          <v-card color="primaryShowCard">
            <v-card-title class="text-center">{{ api.name }}</v-card-title>
            <v-card-subtitle class="text-center">{{ api.apiType }}</v-card-subtitle>
            <v-row>
              <v-col sm="12" md="8" lg="6">
                <v-card-text>
                  <v-container grid-list-xs class="text-center">
                    <v-text-field readonly dense variant="underlined" :value="api.jsFile"
                      :hint="$t('TranslatorSettings.jsFile')">
                    </v-text-field>
                  </v-container>
                </v-card-text>
              </v-col>
              <v-col sm="12" md="4" lg="2">
                <v-select :items="apiType" v-model="api.apiType" variant="underlined"
                  :disabled="api.selectSwitchDisable" :label="$t('TranslatorSettings.selectApiType')"></v-select>
                <v-switch color="primary" v-model="api.enable" :label="`${api.name}是否打开:${api.enable}`"
                  @change="() => toggleEnable(index, api.enable)">
                </v-switch>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-dialog v-model="sureSetting" width="350" height="500">
        <v-card>
          <v-card-title class="d-flex justify-center">
            <span>{{ $t('TranslatorSettings.want progress') }}</span>
          </v-card-title>
          <v-card-text>
            <v-card-subtitle class="d-flex justify-center">{{ $t('TranslatorSettings.deleteOrSend') }}</v-card-subtitle>
          </v-card-text>
          <v-spacer></v-spacer>
          <v-card-actions class="d-flex justify-space-around">
            <v-btn color="success" @click="sure">{{ $t('TranslatorSettings.sure') }}</v-btn>
            <v-btn color="error" @click="cancel">{{ $t('TranslatorSettings.cancel') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch, ref, WatchStopHandle, getCurrentInstance } from 'vue'
import { YkPageHeader } from '.';
import { configStore } from '@/renderer/store/config';
import { useI18n } from 'vue-i18n';
const sureSetting = ref(false)
const apiType = ['textTranslation', 'mecabTranslation']
const useConfigStore = configStore()
const { t } = useI18n();
const apiWatchers = ref<WatchStopHandle[]>([]);
const onlineApis = computed(() => {
  return useConfigStore.getOnlineApis
})
const instance = getCurrentInstance();
const vuetify3_dialog = instance?.appContext.config.globalProperties.$dialog;
const SureSet = () => {
  sureSetting.value = !sureSetting.value
}
const cancel = () => {
  sureSetting.value = false
}
const sure = () => {
  useConfigStore.saveConfig()
  saveSuccess()
  sureSetting.value = false
}
const saveSuccess = () => {
  vuetify3_dialog?.success({
    text: t('TranslatorSettings.saveSuccess')
  })
}
const updateTextNameByApiType = (api: any) => {
  if (api.enable) {
    if (api.apiType === "mecabTranslation") {
      useConfigStore.setMecabTextName(api.name);
    } else {
      useConfigStore.setTranslationTextName(api.name);
    }
  }
}
const setupApiTypeWatchers = () => {
  // 清理之前的watchers
  apiWatchers.value.forEach(stop => stop());
  apiWatchers.value = [];
  onlineApis.value.forEach((api, index) => {
    // 监视apiType的变化
    const stopApiType = watch(
      () => onlineApis.value[index].apiType,
      (newVal, oldVal) => {
        if (newVal !== oldVal) {
          const duplicates = onlineApis.value.filter((item, idx) => idx !== index && item.apiType === newVal);
          duplicates.forEach(duplicate => {
            duplicate.enable = false;
            duplicate.selectSwitchDisable = true;
          });
          updateTextNameByApiType(api);
        }
      }
    );
    // 监视enable的变化
    const stopEnable = watch(
      () => onlineApis.value[index].enable,
      (newVal, oldVal) => {
        if (newVal !== oldVal) {
          updateTextNameByApiType(api);
        }
      }
    );
    // 存储watchers的stop函数，以便后续可以清理
    apiWatchers.value.push(stopApiType, stopEnable);
  });
};
const toggleEnable = (index: number, newValue: boolean) => {
  useConfigStore.toggleApiEnable(index, newValue);
};
const textTranslationApi = computed(() => {
  return useConfigStore.getTranslationTextName
})
const mecabTranslationApi = computed(() => {
  return useConfigStore.getMecabTextName
})
onMounted(() => {
  useConfigStore.initializeSelectSwitches()
  setupApiTypeWatchers()
})
</script>
<style scoped></style>
