<template>
  <v-card>
    <v-navigation-drawer app :rail="!drawerStore.drawerExpanded" :width="drawerStore.width"
      :rail-width="drawerStore.railWidth" permanent>
      <!-- logo -->
      <v-list class="iconCtl">
        <v-list-item v-if="controlListOrIcon" class="drawer-list-item" two-line title="YUKI"
          :subtitle="$t('mainSilderBar.YUKIGalgameTranslator')"
          prepend-avatar="../layout/../../asserts/icon/whiteyuki.png" nav>
        </v-list-item>
        <v-btn icon @click="toggleSilderbar" variant="plain" :style="{
      fontSize: drawerStore.drawerExpanded ? '18px' : '20px',
      marginLeft: drawerStore.drawerExpanded ? '0' : '6px'
    }">
          <v-icon>
            {{ drawerStore.drawerExpanded ? 'mdi-chevron-left' : 'mdi-chevron-right' }}
          </v-icon>
        </v-btn>
      </v-list>
      <!-- 分界线 -->
      <v-divider></v-divider>
      <!-- 分界线 -->
      <v-list density="compact" nav>
        <v-list-item v-for="(item, i) in sidebarLinks" :key="i" :to="item.path" :title="$t(item.text)"
          :prepend-icon="item.icon" rounded="shaped" :value="item.text" color="primary" height="50">
        </v-list-item>
        <v-list-group>
          <!-- 触发器 -->
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" :title="$t(settingBar[0].text)" :prepend-icon="settingBar[0].icon"
              rounded="shaped" height="50"></v-list-item>
          </template>
          <v-list-item v-for="(item, i) in settingBarChildren" :key="i" :to="item.path" :title="$t(item.text)"
            :prepend-icon="item.icon" :value="item.text" rounded="shaped" height="50"></v-list-item>
        </v-list-group>
      </v-list>
      <!-- 白天或者夜间模式 -->
      <transition name="fade" enter-active-class="animate__animated animate__fadeIn">
        <div class="switch-container" v-if="drawerStore.drawerExpanded">
          <v-switch :label="lightOrDarkLabel" inset @click="toggleLightOrDark"></v-switch>
        </div>
      </transition>
    </v-navigation-drawer>
    <v-main>
      <RouterView></RouterView>
    </v-main>
  </v-card>
</template>

<script setup lang="tsx">
import { usedrawerStore } from '../../store/counter'
import { ref, computed } from 'vue'
import { useTheme } from 'vuetify'
import { sidebarLinks, settingBarChildren, settingBar } from '../../routerlink/index'
const drawerStore = usedrawerStore()
// vuetify3运用的主题方法，以后不知道可不可以用
const theme = useTheme()
const controlListOrIcon = ref(true)
// 控制silderbarnavigation-drawer的开关
const toggleSilderbar = () => {
  controlListOrIcon.value = !controlListOrIcon.value
  drawerStore.toggleDrawer()
}
const toggleLightOrDark = () => {
  drawerStore.toggleLightOrDark()
  theme.global.name.value = drawerStore.controlLightOrDark ? 'light' : 'dark'
}
// 切换模式
const lightOrDarkLabel = computed(() => {
  return drawerStore.controlLightOrDark ? '白天模式' : '夜间模式';
});
</script>

<style scoped>
.no-margin-padding {
  display: flex;
  justify-content: center;
  min-height: 100vh;
  padding: 0;
  margin: 0;
}

.iconCtl {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 16px;
}

.switch-container {
  position: absolute;
  bottom: 0;
  /* 放置在底部 */
  width: 100%;
  /* 确保宽度与父容器一致 */
  padding: 0 16px;
  /* 根据需要调整内边距以与其他内容对齐 */
}
</style>
