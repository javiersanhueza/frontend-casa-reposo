<template>
  <q-page class="row bg-page items-center justify-evenly">
    <div class="container-login">
      <q-card class="glass-card">
        <q-card-section class="text-center">
          <!--
          <q-img
            src="src/assets/logo_app_white.png"
            width="50%"
            height="50%"
            color="white"
          />
          -->
        </q-card-section>
        <q-card-section>
          <login />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import Login from 'pages/public/LoginPage/components/Login.vue';

export default defineComponent({
  name: 'LoginPage',

  components: {
    Login,
  },

  setup() {
  },
});
</script>
