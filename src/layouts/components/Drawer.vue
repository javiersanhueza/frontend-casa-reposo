<template>
  <q-scroll-area class="fit">
    <q-list padding>
      <q-expansion-item
        label="Gestión"
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

      <!--

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

      -->

      <q-separator class="q-my-sm" />

      <q-expansion-item
        v-if="menuConfig.length > 0"
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
import { ref, defineComponent, onMounted } from 'vue';
import ItemComponent from 'layouts/components/Item.vue';
import { Menu } from 'layouts/interfaces';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'DrawerComponent',
  components: { ItemComponent },

  setup() {
    const route = useRoute();
    const link = ref(route.name);

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userRoles = user?.roles || {};

    const hasRole = (allowedRoles: string[]) => {
      return allowedRoles.some(role => userRoles[role] === true);
    };

    const menuResults = ref<Menu[]>([
      { id: 1, to: 'Home', icon: 'home', label: 'Home' },
      { id: 1, to: 'ResidentPage', icon: 'elderly', label: 'Residentes' },
    ]);

    const menuConfigCompany = ref<Menu[]>([
      { id: 1, to: 'Areas', icon: 'store', label: 'Áreas' },
      { id: 2, to: 'Employee', icon: 'badge', label: 'Trabajadores' }
    ]);

    const menuConfig = ref<Menu[]>([
      { id: 2, to: 'OptionMaintainer', icon: 'tune', label: 'Mantenedor de opciones' }
    ]);

    const addRestrictedMenus = () => {
      if (hasRole(['superUser', 'admin'])) {
        menuConfig.value.unshift({
          id: 3,
          to: 'UsersPage',
          icon: 'manage_accounts',
          label: 'Usuarios'
        });
      }
    };

    const setActive = (to: string) => {
      link.value = to;
    };

    onMounted(() => {
      addRestrictedMenus();
    });

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
