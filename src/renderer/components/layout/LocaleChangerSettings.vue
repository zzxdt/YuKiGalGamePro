<template>
  <div>
    <YkPageHeader :yktitle="$t('mainSilderBar.localeChanger')"></YkPageHeader>
    <YkPageContent>
      <v-container grid-list-xs>
        <v-row>
          <v-col sm="12" md="6" lg="4">
            <v-btn rounded color="success" @click="saveSettings">{{ $t('mainSilderBar.save') }}</v-btn>
          </v-col>
          <v-col sm="12" md="6" lg="4">
          </v-col>
        </v-row>
        <v-row>
          <v-data-table :headers="headers" :items="localeChangers" color="table" hover>
            <template v-slot:top>
              <v-toolbar text color="table">
                <v-toolbar-title>{{ $t('LocaleChangerSettings.localeChangers') }}</v-toolbar-title>
                <v-divider class="border-opacity-50" :thickness="6" inset vertical color="divider"></v-divider>
                <v-spacer></v-spacer>
                <v-btn color="primary" dark class="mb-2" @click="addLocaleChanger">{{ $t('mainSilderBar.add') }}</v-btn>
              </v-toolbar>
            </template>
            <template v-slot:item.enable="{ item }">
              <v-switch v-model="item.enable" @change="setDefault(item.id)" inset></v-switch>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon class="mr-2" @click="editLocaleChanger(item.id)">mdi-pencil</v-icon>
              <v-icon @click="deleteLocaleChanger(item.id)">mdi-delete</v-icon>
            </template>
            <template v-slot:no-data>
              <p class="text-h3">{{ $t('LocaleChangerSettings.noLocaleChanger') }}</p>
            </template>
            <template v-slot:bottom v-if="hideDefaultFooter"></template>
          </v-data-table>
        </v-row>
        <v-row></v-row>
        <v-row>
          <p class="text-subtitle-1">{{ $t('LocaleChangerSettings.escapePatterns') }}</p>
        </v-row>
        <v-row></v-row>
        <v-row>
          <p class="text-subtitle-1">%GAME_PATH%</p>
        </v-row>
        <v-row></v-row>
        <v-row>
          <p class="text-subtitle-1">{{ $t('LocaleChangerSettings.gamePath') }}</p>
        </v-row>
      </v-container>
      <v-dialog v-model="showDialog" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ $t('LocaleChangerSettings.editLocaleChanger') }}</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="6">
                  <v-text-field variant="underlined" v-model="editedItem.id" label="ID"></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field variant="underlined" v-model="editedItem.name"
                    :label="$t('mainSilderBar.name')"></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea rows="1" auto-grow variant="underlined" v-model="editedItem.exec"
                    :label="$t('LocaleChangerSettings.executionType')" append-icon="mdi-dots-horizontal"
                    @click:append="requestPath()"></v-textarea>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" @click="closeDialog">{{ $t('mainSilderBar.cancel') }}</v-btn>
            <v-btn color="blue darken-1" :disabled="!canSave" @click="finishDialog">{{ $t('mainSilderBar.ok') }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </YkPageContent>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, reactive, getCurrentInstance } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import IpcTypes from '@/common/IpcTypes';
import { YkPageHeader, YkPageContent } from '.';
import { configStore } from '@/renderer/store/config';
const hideDefaultFooter = ref(true)
const useConfigStore = configStore()
const instance = getCurrentInstance();
const vuetify3_dialog = instance?.appContext.config.globalProperties.$dialog;
const localeChangers = computed(() => {
  const items = useConfigStore.default.localeChangers
  return Object.entries(items).map(([id, item]) => ({ id, ...item }))
})
const headers = computed(() => [
  {
    title: 'ID',
    value: 'id'
  },
  {
    title: t('mainSilderBar.name'),
    value: 'name'
  },
  {
    title: t('LocaleChangerSettings.executionType'),
    value: 'exec'
  },
  {
    title: t('LocaleChangerSettings.setToDefault'),
    value: 'enable',
    width: 80
  },
  {
    title: t('LocaleChangerSettings.actions'),
    value: 'actions',
    width: 96
  }
])
const showDialog = ref(false)
const editedItem = reactive({
  id: '',
  name: '',
  exec: '',
  enable: false
});
const saveSuccess = () => {
  vuetify3_dialog?.success({
    text: t('TranslatorSettings.saveSuccess')
  })
}
const canSave = ref(false)
const editLocaleChanger = (itemID: string) => {
  const items = localeChangers.value.find(item => item.id === itemID);
  if (items) {
    editedItem.id = items.id;
    editedItem.name = items.name;
    editedItem.enable = items.enable;
    showDialog.value = true;
  }
}
const setDefault = (id: string) => {
  localeChangers.value.forEach(item => {
    item.enable = item.id === id;
  });
}
const deleteLocaleChanger = (id: string) => {
  useConfigStore.deleteLocaleChanger(id);
}
const addLocaleChanger = () => {
  const newName = "NewLocaleChanger";
  const newExecPath = "path/to/executable";
  useConfigStore.addLocaleChanger(newName, newExecPath, false);
}
const saveSettings = () => {
  useConfigStore.saveConfig()
  saveSuccess()
}
const requestPath = () => {
  window.mainApi.requestPathWithFile()
}
const finishDialog = () => {
  if (editedItem.name) {
    useConfigStore.editLocaleChanger(editedItem.id, {
      name: editedItem.name,
      exec: editedItem.exec,
      enable: editedItem.enable
    });
    showDialog.value = false;
  } else {
    console.error("Name is required for editing a locale changer.");
  }
}
const closeDialog = () => {
  showDialog.value = false
}
onMounted(() => {
  window.mainApi.once(IpcTypes.HAS_PATH_WITH_FILE, (event: any, hasFileName: string) => {
    editedItem.exec = hasFileName
    canSave.value = true
  })
})

</script>

<style scoped></style>
