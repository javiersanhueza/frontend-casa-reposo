<template>
  <q-form
    @submit="onSubmit"
  >
    <q-input
      color="white"
      v-model="name"
      label="Nombre"
      label-color="white"
      input-style="color: white;"
      lazy-rules
      :rules="[
        val => val && val.length > 0 || 'Campo requerido'
      ]"
    >
      <template v-slot:prepend>
        <q-icon name="person" color="white" />
      </template>
    </q-input>
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
      autocomplete="off"
    >
      <template v-slot:prepend>
        <q-icon name="mail" color="white" />
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
      autocomplete="new-password"
    >
      <template v-slot:prepend>
        <q-icon name="lock" color="white" />
      </template>
    </q-input>
    <q-input
      color="white"
      v-model="passwordConfirm"
      label="Confirma la contraseña"
      label-color="white"
      type="password"
      input-style="color: white;"
      lazy-rules
      :rules="[
        val => val && val.length > 0 || 'Campo requerido',
        val => val === password || 'Las contraseñas no coinciden'
      ]"
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
        label="Registrar"
        text-color="grey-8"
      />
    </div>
  </q-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Notify } from 'quasar';
import { useRouter } from 'vue-router';

import { useAuthStore } from 'stores/auth';
import pinia from 'src/stores';

export default defineComponent({
  name: 'RegisterComponent',
  setup() {
    const router = useRouter();
    const email = ref<string>('');
    const name = ref<string>('');
    const password = ref<string>('');
    const passwordConfirm = ref<string>('');
    const authStore = useAuthStore(pinia());

    const onSubmit = async () => {
      const response = await authStore.register(name.value, email.value, password.value);

      if (response?.user) {
        router.push({ name: 'Login' });
        Notify.create({
          type: 'positive',
          message: 'Usuario creado con éxito',
          position: 'top',
          timeout: 3000
        });
      }
    };

    return {
      name,
      email,
      password,
      passwordConfirm,

      onSubmit
    }
  }
})
</script>
