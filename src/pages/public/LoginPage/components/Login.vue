<template>
  <q-card class="shadow-10 login-card q-pa-lg" style="width: 100%; max-width: 420px; border-radius: 16px;">

    <q-card-section class="text-center q-pb-none">
      <q-avatar size="72px" color="blue-1" text-color="primary" class="q-mb-md">
        <q-icon name="health_and_safety" size="40px" />
      </q-avatar>
      <div class="text-h5 text-weight-bold text-dark">Bienvenido de nuevo</div>
      <div class="text-subtitle2 text-grey-6 q-mt-xs q-mb-md">
        Ingresa tus credenciales para continuar
      </div>
    </q-card-section>

    <q-card-section>
      <q-form @submit.prevent="onSubmit" class="q-gutter-y-md">

        <q-input
          outlined
          v-model="email"
          label="Correo Electrónico"
          type="email"
          color="primary"
          bg-color="white"
          lazy-rules
          :rules="[
            val => val && val.length > 0 || 'Campo requerido',
            val => /.+@.+\..+/.test(val) || 'Email no válido'
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="email" color="grey-6" />
          </template>
        </q-input>

        <q-input
          outlined
          v-model="password"
          label="Contraseña"
          :type="showPassword ? 'text' : 'password'"
          color="primary"
          bg-color="white"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Campo requerido']"
        >
          <template v-slot:prepend>
            <q-icon name="lock" color="grey-6" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="showPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer text-grey-6"
              @click="showPassword = !showPassword"
            />
          </template>
        </q-input>

        <div class="q-mt-lg">
          <q-btn
            unelevated
            type="submit"
            class="full-width text-weight-bold q-py-sm"
            color="primary"
            label="Ingresar"
            size="lg"
            style="border-radius: 8px;"
          />
        </div>
      </q-form>
    </q-card-section>

    <q-card-section class="text-center q-pt-none q-mt-sm">
      <q-btn
        @click="router.push({ name: 'ForgotPassword' })"
        label="¿Olvidaste tu contraseña?"
        flat
        color="primary"
        no-caps
        dense
        class="text-body2 text-weight-medium q-mb-sm"
      />
      <div class="text-grey-7 text-body2">
        ¿No tienes una cuenta?
        <q-btn
          @click="router.push({ name: 'Register' })"
          label="Regístrate"
          flat
          color="secondary"
          no-caps
          dense
          class="text-weight-bold q-ml-xs"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

import pinia from 'src/stores';
import { useAuthStore } from 'stores/auth';
import { useResidenceStore } from 'stores/residence';

export default defineComponent({
  name: 'LoginComponent',
  setup() {
    const $q = useQuasar();
    const router = useRouter();

    const email = ref<string>('');
    const password = ref<string>('');
    const showPassword = ref<boolean>(false);

    const authStore = useAuthStore(pinia());
    const residenceStore = useResidenceStore(pinia());

    const onSubmit = async () => {
      await authStore.login(email.value, password.value);

      if (authStore.isAuthenticated) {
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;

        if (user?.roles?.superUser) {
          await router.push({ name: 'Home' });
        } else {

          await residenceStore.getResidencesPagination();
          const companies = residenceStore.residences || [];

          localStorage.setItem('companies', JSON.stringify(companies));

          if (companies.length > 1) {
            localStorage.removeItem('companySelected');
            await router.push({ name: 'ChangeCompany' });

          } else if (companies.length === 1) {
            localStorage.setItem('companySelected', JSON.stringify(companies[0]));
            await router.push({ name: 'Home' });

          } else {
            $q.notify({
              type: 'warning',
              message: 'No tienes residencias asignadas. Contacta a un administrador.',
              position: 'top-right'
            });
            await router.push({ name: 'Home' });
          }
        }
      }
    };

    return {
      email,
      password,
      showPassword,
      router,
      onSubmit
    };
  }
});
</script>

<style scoped>
.login-card {
  background: rgba(255, 255, 255, 0.98);
}
</style>
