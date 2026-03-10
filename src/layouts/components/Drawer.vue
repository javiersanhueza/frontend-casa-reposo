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
import { ref, computed, defineComponent, watch } from 'vue'; // <-- 1. Importar watch
import ItemComponent from 'layouts/components/Item.vue';
import { Menu } from 'layouts/interfaces';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'DrawerComponent',
  components: { ItemComponent },

  setup() {
    const route = useRoute();
    const link = ref(route.name);

    watch(
      () => route.name,
      (newRouteName) => {
        link.value = newRouteName;
      }
    );

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userRoles = user?.roles || {};

    const hasRole = (allowedRoles?: string[]) => {
      if (!allowedRoles || allowedRoles.length === 0) return true;

      return allowedRoles.some(roleStr => {
        if (roleStr.includes(':')) {
          const [roleKey, roleValue] = roleStr.split(':');
          return userRoles[roleKey] === roleValue;
        }
        return userRoles[roleStr] === true;
      });
    };

    const rawMenuResults: Menu[] = [
      { id: 1, to: 'Home', icon: 'home', label: 'Home' },{
        id: 2,
        to: 'ResidentPage',
        icon: 'elderly',
        label: 'Residentes',
        roles: ['admin', 'owner:Administrador Residencia', 'owner:Dueño Residencia']
      },
      {
        id: 8,
        to: 'Employee',
        icon: 'badge',
        label: 'Trabajadores',
        roles: ['owner:Administrador Residencia', 'owner:Dueño Residencia']
      }
    ];

    const rawMenuConfigCompany: Menu[] = [
      { id: 3, to: 'Areas', icon: 'store', label: 'Áreas' },
      { id: 4, to: 'Employee', icon: 'badge', label: 'Trabajadores' }
    ];

    const rawMenuConfig: Menu[] = [
      {
        id: 5,
        to: 'ResidencesPage',
        icon: 'domain',
        label: 'Residencias',
        roles: ['superUser', 'admin']
      },
      {
        id: 6,
        to: 'UsersPage',
        icon: 'manage_accounts',
        label: 'Usuarios',
        roles: ['superUser', 'admin']
      }
    ];

    const menuResults = computed(() => rawMenuResults.filter(item => hasRole(item.roles)));
    const menuConfigCompany = computed(() => rawMenuConfigCompany.filter(item => hasRole(item.roles)));
    const menuConfig = computed(() => rawMenuConfig.filter(item => hasRole(item.roles)));

    const setActive = (to: string) => {
      link.value = to;
    };

    return {
      menuResults,
      menuConfigCompany,
      menuConfig,
      link,
      setActive
    };
  }
});
</script>
