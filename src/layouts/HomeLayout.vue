<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-2">

    <q-header class="background-header text-white shadow-2">
      <q-toolbar class="q-px-md" style="min-height: 64px;">

        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <div class="q-ml-sm text-h6 text-weight-bold flex items-center letter-spacing-1" v-if="$q.screen.gt.xs">
          <q-icon name="health_and_safety" size="sm" class="q-mr-sm" />
          Mi Plataforma
        </div>

        <q-space></q-space>

        <q-chip
          v-if="!isSuperUser"
          color="white"
          text-color="primary"
          icon="apartment"
          class="text-weight-bold shadow-1 q-mr-md q-py-sm"
        >
          {{ getNameCompany() }}
        </q-chip>

        <div class="column q-ml-sm">
          <menu-component />
        </div>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="260"
      class="bg-white"
      :elevation="1"
    >
      <drawer-component />
    </q-drawer>

    <q-page-container>
      <div class="">
        <router-view />
      </div>
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

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const isSuperUser = user?.roles?.superUser === true;

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    return {
      leftDrawerOpen,
      isSuperUser,

      toggleLeftDrawer,
    };
  },
});
</script>
