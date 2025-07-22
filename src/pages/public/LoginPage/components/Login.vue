<template>
  <q-form
    @submit="onSubmit"
  >
    <q-input
      color="white"
      v-model="email"
      label="Email"
      label-color="white"
      input-style="color: white;"
      lazy-rules
      :rules="[
        val => val && val.length > 0 || 'Campo requerido',
        val => /.+@.+\..+/.test(val) || 'Email no válido'
      ]"
    >
      <template v-slot:prepend>
        <q-icon name="person" color="white" />
      </template>
    </q-input>
    <q-input
      color="white"
      v-model="password"
      label="Contraseña"
      label-color="white"
      type="password"
      input-style="color: white;"
      lazy-rules
      :rules="[ val => val && val.length > 0 || 'Campo requerido']"
    >
      <template v-slot:prepend>
        <q-icon name="lock" color="white" />
      </template>
    </q-input>
    <div class="text-center q-mt-md">
      <q-btn
        rounded
        type="submit"
        class="q-py-md q-px-lg full-width"
        color="white"
        label="Ingresar"
        text-color="grey-8"
      />
    </div>
    <div class="text-center q-mt-md">
      <q-btn
        @click="router.push({ name: 'ForgotPassword' })"
        label="¿Olvidaste tu contraseña?"
        flat
        rounded
        color="white"
        no-caps
      />
      <br>
      <q-btn
        @click="router.push({ name: 'Register' })"
        label="¿No tienes una cuenta? Registrate"
        flat rounded
        color="white"
        no-caps
      />
    </div>
  </q-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

import pinia from 'src/stores';
import { useAuthStore } from 'stores/auth';
// import { useCompanyStore } from 'stores/company';


export default defineComponent({
  name: 'LoginComponent',
  setup() {
    const email = ref<string>('');
    const password = ref<string>('');
    const authStore = useAuthStore(pinia());
    // const companyStore = useCompanyStore(pinia());
    const router = useRouter();

    const onSubmit = async () => {
      await authStore.login(email.value, password.value);
      if (authStore.isAuthenticated) {
        await router.push({ name: 'Home' });

        // Obtener las empresas del usuario

        /*await companyStore.getCompaniesForUser();

        if (companyStore.companies!.length >= 2) {

          // selección de empresa
          router.push({ name: 'ChangeCompany' });
        } else {
          if (companyStore.companies && companyStore.companies.length > 0) {
            // setear la empresa en el local storage y redirigir al home
            localStorage.setItem('company', JSON.stringify(companyStore.companies[0]));
            router.push({ name: 'Home' });
          }
        } */
      }
    }
    return {
      email,
      password,
      router,

      onSubmit
    }
  }
})
</script>
