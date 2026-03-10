<template>
  <q-btn round flat class="q-ml-sm">
    <q-avatar size="38px" color="primary" text-color="white" class="shadow-1">
      {{ userInitials }}
    </q-avatar>

    <q-menu
      v-model="menu"
      anchor="bottom right"
      self="top right"
      transition-show="jump-down"
      transition-hide="jump-up"
      style="min-width: 260px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);"
    >
      <q-list class="q-py-sm">

        <q-item class="q-pb-md">
          <q-item-section avatar>
            <q-avatar size="48px" color="primary" text-color="white">
              {{ userInitials }}
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold text-subtitle2 text-grey-9">
              {{ user?.firstName }} {{ user?.firstSurname }}
            </q-item-label>
            <q-item-label caption class="text-grey-6 ellipsis q-mb-xs">
              {{ user?.email }}
            </q-item-label>

            <div>
              <q-badge
                :color="userRoleInfo.color"
                :label="userRoleInfo.label"
                class="text-weight-bold q-py-xs q-px-sm"
                style="border-radius: 4px;"
              />
            </div>
          </q-item-section>
        </q-item>

        <q-separator inset class="q-mb-sm" />

        <q-item
          v-for="option in menuConfigUser"
          :key="option.id"
          clickable
          v-close-popup
          :to="{ name: option.to }"
          class="text-grey-8"
        >
          <q-item-section avatar style="min-width: 40px;">
            <q-icon :name="option.icon" color="grey-6" size="sm" />
          </q-item-section>
          <q-item-section class="text-body2 text-weight-medium">
            {{ option.label }}
          </q-item-section>
        </q-item>

        <q-separator inset class="q-my-sm" />

        <q-item
          clickable
          v-close-popup
          @click="logOut"
          class="text-negative"
        >
          <q-item-section avatar style="min-width: 40px;">
            <q-icon name="logout" color="negative" size="sm" />
          </q-item-section>
          <q-item-section class="text-body2 text-weight-medium">
            Cerrar sesión
          </q-item-section>
        </q-item>

      </q-list>
    </q-menu>
  </q-btn>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { Menu } from 'layouts/interfaces';

export default defineComponent({
  name: 'MenuComponent',

  setup() {
    const router = useRouter();
    const menu = ref(false);

    const userStr = localStorage.getItem('user');
    const user = ref(userStr ? JSON.parse(userStr) : null);

    const syncUser = () => {
      const freshUserStr = localStorage.getItem('user');
      user.value = freshUserStr ? JSON.parse(freshUserStr) : null;
    };

    onMounted(() => {
      window.addEventListener('user-profile-updated', syncUser);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('user-profile-updated', syncUser);
    });

    const userInitials = computed(() => {
      if (!user.value) return 'U';
      const first = user.value.firstName ? user.value.firstName.charAt(0).toUpperCase() : '';
      const last = user.value.firstSurname ? user.value.firstSurname.charAt(0).toUpperCase() : '';
      return `${first}${last}`;
    });

    const userRoleInfo = computed(() => {
      const roles = user.value?.roles;
      if (!roles) return { label: 'Sin Rol', color: 'grey-7' };

      if (roles.superUser) return { label: 'Súper Usuario', color: 'purple-7' };
      if (roles.admin) return { label: 'Administrador', color: 'primary' };
      if (roles.owner) return { label: roles.owner, color: 'orange-8' };
      if (roles.employee) return { label: 'Empleado', color: 'teal-7' };
      if (roles.proxy) return { label: 'Apoderado', color: 'accent' };

      return { label: 'Usuario', color: 'grey-7' };
    });

    const logOut = () => {
      localStorage.clear();
      router.push({ name: 'Login' });
    };

    const menuConfigUser = computed<Menu[]>(() => {
      const menu: Menu[] = [];

      if (!user.value?.roles?.superUser) {
        menu.push({
          id: 1,
          to: 'ChangeCompany',
          icon: 'apartment',
          label: 'Cambiar de residencia'
        });
      }

      menu.push({
        id: 2,
        to: 'EditUser',
        icon: 'manage_accounts',
        label: 'Mi perfil'
      });

      return menu;
    });

    return {
      user,
      userInitials,
      menu,
      menuConfigUser,
      userRoleInfo,
      logOut
    };
  }
});
</script>
