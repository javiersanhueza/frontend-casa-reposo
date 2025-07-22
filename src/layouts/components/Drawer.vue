<template>
  <q-scroll-area class="fit">
    <q-list padding>
      <q-expansion-item
        label="REGISTRO DE ACCIDENTES"
        header-class="text-grey-7 text-weight-bold text-uppercase"
        default-opened
      >
        <item-component
          v-for="option in menuResults"
          :id="option.id"
          :key="option.id"
          :to="option.to"
          :show="link === option.to"
          :label="option.label"
          :icon="option.icon"
          :set-active="() => setActive(option.to)"
        />
      </q-expansion-item>

      <q-separator class="q-my-sm" />

      <q-expansion-item
        label="CONFIGURACIÓN DE LA EMPRESA"
        header-class="text-grey-7 text-weight-bold text-uppercase"
        default-opened
      >
        <item-component
          v-for="option in menuConfigCompany"
          :id="option.id"
          :key="option.id"
          :to="option.to"
          :show="link === option.to"
          :label="option.label"
          :icon="option.icon"
          :set-active="() => setActive(option.to)"
        />
      </q-expansion-item>

      <q-separator class="q-my-sm" />

      <q-expansion-item
        label="CONFIGURACIONES GLOBALES"
        header-class="text-grey-7 text-weight-bold text-uppercase"
        default-opened
      >
        <item-component
          v-for="option in menuConfig"
          :id="option.id"
          :key="option.id"
          :to="option.to"
          :show="link === option.to"
          :label="option.label"
          :icon="option.icon"
          :set-active="() => setActive(option.to)"
        />
      </q-expansion-item>
    </q-list>
  </q-scroll-area>
</template>

<script lang="ts">
import { ref, defineComponent } from 'vue';

import ItemComponent from 'layouts/components/Item.vue';
import { Menu } from 'layouts/interfaces';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'DrawerComponent',
  components: { ItemComponent },

  setup() {
    const route = useRoute();
    const link = ref(route.name)

    const menuResults = ref<Menu[]>([
      {
        id: 1,
        to: 'Home',
        icon: 'home',
        label: 'Home',
      },
      {
        id: 2,
        to: 'Accidents',
        icon: 'personal_injury',
        label: 'Accidentes',
      },
    ]);

    const menuConfigCompany = ref<Menu[]>([
      {
        id: 1,
        to: 'Areas',
        icon: 'store',
        label: 'Áreas',
      },
      {
        id: 2,
        to: 'Employee',
        icon: 'badge',
        label: 'Trabajadores'
      }
    ]);

    const menuConfig = ref<Menu[]>([
      {
        id: 1,
        to: 'ResidentPage',
        icon: 'elderly',
        label: 'Residentes',
      },
      {
        id: 2,
        to: 'OptionMaintainer',
        icon: 'tune',
        label: 'Mantenedor de opciones'
      }
    ]);

    const setActive = (to: string) => {
      link.value = to;
    };

    return {
      menuResults,
      menuConfig,
      menuConfigCompany,
      link,

      setActive
    };
  }
});
</script>
