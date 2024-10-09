<template>
  <q-page class="row bg-page items-center justify-evenly">
    <div class="container-login">
      <q-card class="wrap-login100">
        <q-card-section>
          <div class="text-h6 text-center text-white">
            Ingresa tu nueva contraseña.
          </div>
        </q-card-section>
        <q-card-section>
          <reset-password />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import ResetPassword from 'pages/public/ResetPasswordPage/components/ResetPassword.vue';

export default defineComponent({
  name: 'ResetPasswordPage',

  components: {
    ResetPassword
  }
});

</script>
