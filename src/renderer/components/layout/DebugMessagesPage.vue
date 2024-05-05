<template>
  <div>
    <YkPageHeader :yktitle="$t('mainSilderBar.debugMessages')"></YkPageHeader>
    <YkPageContent>
      <v-container grid-list-xs>
        <v-toolbar color="debugBar">
          <v-app-bar-nav-icon></v-app-bar-nav-icon>
          <v-toolbar-title>{{ $t('DebugMessagesPage.log') }}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <p class="vertical-center">{{ $t('DebugMessagesPage.maxColumns') }}: 1000</p>
          <v-spacer></v-spacer>
          <v-btn color="primary" dark class="mb-2">
            {{ $t('DebugMessagesPage.copyToClipboard') }}
          </v-btn>
        </v-toolbar>
        <div class="console" ref="terminalContainer"></div>
      </v-container>
    </YkPageContent>
  </div>
</template>

<script setup>
import { YkPageHeader, YkPageContent } from '.'
</script>

<style scoped>
.console {
  height: 300px;
  background-color: black;
  color: lime;
  font-family: monospace;
}
</style>
