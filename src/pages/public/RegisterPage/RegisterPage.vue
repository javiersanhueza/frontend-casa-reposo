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
          <div
            class="text-h4 text-center text-white"
            style="letter-spacing: 0.1rem"
          >
            REGISTRATE
          </div>
        </q-card-section>
        <q-card-section>
          <register-component />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import RegisterComponent from 'pages/public/RegisterPage/components/Register.vue';


export default defineComponent({
  name: 'RegisterPage',

  components: {
    RegisterComponent
  },

  setup() {
    const router = useRouter();

    return {
      router
    }
  }
})
</script>
