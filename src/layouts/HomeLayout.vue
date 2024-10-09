<template>
  <q-layout view="hHh LpR fFf">

    <q-header elevated class="background-header text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          Resultados operacionales
        </q-toolbar-title>
        <q-space ></q-space>
        <div class="colum">
          <div class="col text-caption text-right text-weight-bold">
            {{ user?.name }}
          </div>
          <div class="col text-caption text-right">
            {{ user?.email }}
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      :width="250"
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      bordered
      class="bg-grey-2"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <q-expansion-item
            label="RESULTADOS"
            header-class="text-grey-7 text-weight-bold text-uppercase"
            default-opened
          >
            <q-item
              v-for="(option) in menuResults"
              :key="option.id"
              :to="{ name: option.to }"
              active
            >
              <q-item-section avatar>
                <q-icon :name="option.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ option.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-expansion-item>

          <q-separator class="q-my-sm" />

          <!--

          <q-expansion-item
            label="CONFIGURACIONES"
            header-class="text-grey-7 text-weight-bold text-uppercase"
            default-opened
          >
            <q-item
              v-for="(option) in menuConfig"
              :key="option.id"
              :to="{ name: option.to }"
              active
            >
              <q-item-section avatar>
                <q-icon :name="option.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ option.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-expansion-item>

          <q-separator class="q-my-sm" />

          -->
          <q-item
            clickable
            v-ripple
            @click="logOut()"
            class="my-item"
          >
            <q-item-section
              avatar
            >
              <q-icon name="logout" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Cerrar Sesión</q-item-label>
            </q-item-section>
          </q-item>

        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container >
      <router-view class="q-pa-lg" />
    </q-page-container>

  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { UserLogin } from 'src/interfaces/auth/auth.interfaces';

interface Menu {
  id: number;
  to: string;
  show: boolean;
  icon: string;
  label: string;
}

export default defineComponent({
  name: 'HomeLayout',
  setup() {
    const leftDrawerOpen = ref(false);
    const router = useRouter();
    const user: UserLogin = JSON.parse(localStorage.getItem('user')!);

    const menuResults = ref<Menu[]>([
      {
        id: 1,
        to: 'Home',
        show: true,
        icon: 'home',
        label: 'Home'
      }
    ]);

    const menuConfig = ref<Menu[]>([
      {
        id: 1,
        to: 'EditUser',
        show: true,
        icon: 'edit',
        label: 'Editar mis datos'
      }
    ]);

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value
    };

    const logOut = () => {
      localStorage.clear();
      router.push({ name: 'Login' });
    };

    return {
      menuResults,
      menuConfig,
      leftDrawerOpen,
      user,

      toggleLeftDrawer,
      logOut
    }
  }
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
