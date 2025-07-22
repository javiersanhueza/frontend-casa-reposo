<template>
  <q-btn round flat size="lg" icon="account_circle">
    <q-menu v-model="menu" anchor="bottom right" self="top right">
      <div class="row no-wrap q-pa-md" v-if="$q.screen.gt.xs">
        <div class="column">
          <q-item
            v-for="option in menuConfigUser"
            :key="option.id"
            :to="{ name: option.to }"
            class="text-grey-7"
          >
            <q-item-section avatar>
              <q-icon :name="option.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ option.label }}</q-item-label>
            </q-item-section>
          </q-item>
        </div>

        <q-separator vertical inset class="q-mx-lg" />

        <div class="column items-center">
          <q-avatar
            size="50px"
            text-color="grey-7"
            icon="account_circle"
            font-size="50px"
          />

          <div class="col text-caption text-grey-7 text-right text-weight-bold">
            {{ user?.name }}
          </div>
          <div class="col text-caption text-grey-7 text-right">
            {{ user?.email }}
          </div>

          <q-btn
            @click="logOut()"
            label="Cerrar sesión"
            text-color="white"
            push
            icon="logout"
            size="sm"
            class="q-mt-sm background-header full-width"
          />
        </div>
      </div>
      <div class="row no-wrap q-pa-md" v-else>
        <div class="column items-center">
          <q-avatar
            size="50px"
            text-color="grey-7"
            icon="account_circle"
            font-size="50px"
          />

          <div class="col text-caption text-right text-grey-7 text-weight-bold">
            {{ user?.name }}
          </div>
          <div class="col text-caption text-right text-grey-7">
            {{ user?.email }}
          </div>

          <q-btn
            v-for="option in menuConfigUser"
            :key="option.id"
            :to="{ name: option.to }"
            :label="option.label"
            :icon="option.icon"
            text-color="white"
            size="sm"
            class="q-mt-sm background-header full-width"
            push
          />

          <q-btn
            @click="logOut()"
            label="Cerrar sesión"
            text-color="white"
            push
            icon="logout"
            size="sm"
            class="q-mt-sm background-header full-width"
          />
        </div>
      </div>
    </q-menu>
  </q-btn>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

import { UserLogin } from 'src/interfaces/auth/auth.interfaces';
import { Menu } from 'layouts/interfaces';

export default defineComponent({
  name: 'MenuComponent',

  setup() {
    const router = useRouter();
    const user: UserLogin = JSON.parse(localStorage.getItem('user')!);
    const menu = ref(false);

    const logOut = () => {
      localStorage.clear();
      router.push({ name: 'Login' });
    };

    const menuConfigUser = ref<Menu[]>([
      {
        id: 1,
        to: 'ChangeCompany',
        icon: 'apartment',
        label: 'Cambiar de empresa',
      },
      {
        id: 1,
        to: 'EditUser',
        icon: 'edit',
        label: 'Editar mis datos',
      },
    ]);

    return {
      user,
      menu,
      menuConfigUser,

      logOut
    }

  }
})

</script>
