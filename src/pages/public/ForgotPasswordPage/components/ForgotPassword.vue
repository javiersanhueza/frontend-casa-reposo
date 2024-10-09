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
      autocomplete="off"
    >
      <template v-slot:prepend>
        <q-icon name="mail" color="white" />
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
      />
    </div>
  </q-form>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';

import pinia from 'src/stores';
import { useAuthStore } from 'stores/auth';

export default defineComponent({
  name: 'ForgotPassword',

  setup() {
    const email = ref<string>('');

    const authStore = useAuthStore(pinia());

    const onSubmit = async () => {
      await authStore.forgotPassword(email.value);
      email.value = '';
    };

    return {
      email,

      onSubmit
    }
  }
})
</script>
