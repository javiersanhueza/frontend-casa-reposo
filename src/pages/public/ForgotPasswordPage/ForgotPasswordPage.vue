<template>
  <q-page class="row bg-page items-center justify-evenly">
    <div class="container-login">
      <q-card class="wrap-login100">
        <q-card-section>
          <q-btn
            @click="router.push({ name: 'Login' })"
            icon="arrow_back_ios"
            flat
            rounded
            color="white"
            label="Volver"
            no-caps
          />
        </q-card-section>
        <q-card-section>
          <div class="text-h6 text-center text-white">
            Ingresa tu correo para recuperar la contraseña.
          </div>
        </q-card-section>
        <q-card-section>
          <forgot-password />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

import ForgotPassword from 'pages/public/ForgotPasswordPage/components/ForgotPassword.vue';

export default defineComponent({
  name: 'ForgotPasswordPage',

  components: {
    ForgotPassword,
  },

  setup() {
    const router = useRouter();

    return {
      router,
    };
  },
});
</script>
