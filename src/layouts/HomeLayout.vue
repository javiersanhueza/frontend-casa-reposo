<template>
  <q-layout view="hHh LpR fFf" class="bg-grey-3 q-pa-lg">
    <q-header elevated class="background-header text-white">
      <q-toolbar>
        <q-btn cdense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-img
          src="src/assets/logo_vertical_white.png"
          width="8%"
          color="white"
          v-if="$q.screen.gt.xs"
          class="q-ml-md"
        />

        <q-space></q-space>

        <q-badge rounded color="amber-7" :label="getNameCompany()" />

        <div class="colum q-ml-sm">
          <menu-component />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      :width="250"
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      bordered
      class="bg-white"
    >
      <drawer-component />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

import MenuComponent from 'layouts/components/Menu.vue';
import DrawerComponent from 'layouts/components/Drawer.vue';
import { globalMixin } from 'src/mixins/globalMixin';

export default defineComponent({
  name: 'HomeLayout',

  mixins: [globalMixin],

  components: { DrawerComponent, MenuComponent },

  setup() {
    const leftDrawerOpen = ref(false);

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    return {
      leftDrawerOpen,

      toggleLeftDrawer,
    };
  },
});
</script>

<style>
.background-header {
  background: linear-gradient(
    to right,
    #b224ef,
    #7579ff
  ); /* Gradiente de color */
}
</style>
