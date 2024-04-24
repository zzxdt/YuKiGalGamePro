<template>
  <v-navigation-drawer
    app
    expand-on-hover
    rail
    permanent
    @mouseover="drawerStore.drawerExpanded = true"
    @mouseleave="drawerStore.drawerExpanded = false"
  >
    <v-list>
      <v-list-item
        prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
        title="Sandra Adams"
        subtitle="sandra_a88@gmailcom"
      ></v-list-item>
    </v-list>

    <v-divider></v-divider>
    <v-list density="compact" nav>
      <v-list-item
        v-for="(item, i) in manage"
        :key="i"
        :title="item.title"
        :prepend-icon="item.icon"
        :value="item.title"
      ></v-list-item>

      <v-list-group>
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            title="Users"
            prepend-icon="mdi-account-circle"
            rounded="shaped"
          >
          </v-list-item>
        </template>
        <v-list-item
          v-for="(item, i) in cruds"
          :key="i"
          :title="item.title"
          :prepend-icon="item.icon"
          value="title"
        ></v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
  <YkPageHeader></YkPageHeader>
  <v-main
    class="no-margin-padding"
    :style="{
      'margin-left': drawerStore.drawerWidth,
      'margin-top': drawerStore.silerBarHeight,
      height: '100vh'
    }"
  >
    <v-card>This is a card</v-card>
  </v-main>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue'
// import {GamePageHome} from '.';
import GamePageHome from '@/renderer/components/layout/GamePageHome.vue'
import YkPageHeader from '@/renderer/components/layout/PageHeader.vue'
import YkAboutPage from '@/renderer/components/layout/AboutPage.vue'
import { usedrawerStore } from '@/renderer/store/counter'
export default defineComponent({
  setup() {
    const open = ref(['Users'])
    const admins = ref([
      { title: 'Management', icon: 'mdi-account-multiple-outline' },
      { title: 'Settings', icon: 'mdi-cog-outline' }
    ])
    const cruds = ref([
      { title: 'Create', icon: 'mdi-plus-outline' },
      { title: 'Read', icon: 'mdi-file-outline' },
      { title: 'Update', icon: 'mdi-update' },
      { title: 'Delete', icon: 'mdi-delete' }
    ])
    const manage = ref([
      { title: 'My Files', icon: 'mdi-folder' },
      { title: 'Shared with me', icon: 'mdi-account-multiple' },
      { title: 'Starred', icon: 'mdi-star' },
      { title: '', icon: '' }
    ])
    const drawerStore = usedrawerStore()
    onMounted(() => {
      console.log(drawerStore.drawerWidth)
      console.log(drawerStore.width)
      
    })
    return {
      open,
      admins,
      cruds,
      manage,
      drawerStore
    }
  },

  components: {
    GamePageHome,
    YkPageHeader,
    YkAboutPage
  }
})
</script>
<style scoped>
.no-margin-padding {
  margin: 0;
  padding: 0;
}
</style>

@/renderer/store/Counter
