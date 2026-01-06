<template>
  <div class="text-h6 text-grey-7 q-mb-sm">Usuarios</div>

  <q-card class="q-pa-md" flat style="border-radius: 10px">
    <q-card-section>
      <users-component />
    </q-card-section>
  </q-card>

  <q-page-sticky position="bottom-right" :offset="[18, 18]">
    <q-btn @click="dialogVisible = true" fab icon="add" color="primary">
      <q-tooltip
        v-if="!$q.screen.xs"
        anchor="center left"
        self="center middle"
        :offset="[55, 55]"
      >
        Nuevo usuario
      </q-tooltip>
    </q-btn>
  </q-page-sticky>

  <new-user
    title="Nuevo usuario"
    v-model:dialogVisible="dialogVisible"
    @submitted="handleUserCreate"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Notify } from 'quasar';

import UsersComponent from 'pages/private/UsersPage/components/UsersComponent.vue';
import NewUser from 'pages/private/UsersPage/components/NewUser.vue';
import { useUserStore } from 'stores/user';
import pinia from 'src/stores';
import { globalMixin } from 'src/mixins/globalMixin';

export default defineComponent({
  name: 'UsersPage',

  components: { NewUser, UsersComponent },

  setup() {
    const dialogVisible = ref(false);
    const userStore = useUserStore(pinia());

    const rolesUser = globalMixin.methods.getRolesUser();

    const handleUserCreate = async (newUser: any, closeDialog: () => void) => {
      let response;
      if (rolesUser.superUser) {
        if (newUser.role === 'superUser') {
          response = await userStore.createSuperUser({ ...newUser, secret: 'reposo_jwtkey' });
        } else if (newUser.role === 'admin') {
          response = await userStore.createAdminUser(newUser);
        }
      }

      console.log(response);
      closeDialog();


      if (response) {
        closeDialog();

        Notify.create({
          type: 'positive',
          message: 'Usuario creado con éxito',
          position: 'top',
          timeout: 3000
        })
      }
    }

    return {
      dialogVisible,

      handleUserCreate
    };
  },
});
</script>
