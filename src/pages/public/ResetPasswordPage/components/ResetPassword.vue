<template>
  <q-form
    @submit="onSubmit"
  >
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
      :disable="isPasswordChanged"
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
      :disable="isPasswordChanged"
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
        label="Enviar"
        text-color="grey-8"
        v-if="!isPasswordChanged"
      />
      <q-btn
        @click="router.push({ name: 'Login' })"
        rounded
        class="q-py-md q-px-lg full-width"
        color="white"
        label="Ir a login"
        text-color="grey-8"
        v-if="isPasswordChanged"
      />
    </div>
  </q-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import pinia from 'src/stores';
import { useAuthStore } from 'stores/auth';

export default defineComponent({
  name: 'ResetPassword',

  setup() {
    const router = useRouter();
    const route = useRoute();
    const authStore = useAuthStore(pinia());
    const isPasswordChanged = ref<boolean>(false);

    const password = ref<string>('');
    const passwordConfirm = ref<string>('');

    const onSubmit = async () => {
      const token = route.params.token;
      const response = await authStore.restePassword(password.value, token.toString());

      if (response) {
        isPasswordChanged.value = true;
      }
    }

    return {
      router,
      password,
      passwordConfirm,
      isPasswordChanged,

      onSubmit
    }
  }
})

</script>
