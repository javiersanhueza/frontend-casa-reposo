<template>
  <q-page class="row bg-page items-center justify-evenly">
    <div class="container-login">
      <q-card class="wrap-login100">
        <q-card-section class="text-center">
          <q-avatar
            class="q-mb-lg"
            size="100px"
            font-size="52px"
            color="white"
            text-color="grey-8"
            icon="query_stats"
          />
          <div
            class="text-h4 text-center text-white"
            style="letter-spacing: 0.1rem"
          >
            BIENVENIDO
          </div>
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
