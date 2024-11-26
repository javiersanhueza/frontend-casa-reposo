<template>
  <q-page class="row bg-page items-center justify-evenly">
    <div class="container-login">
      <q-card class="wrap-login100">
        <q-card-section>
          <div class="text-h6 text-center text-white">
            Selecciona una empresa.
          </div>
        </q-card-section>
        <q-card-section>
          <change-company-form />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ChangeCompanyForm from 'pages/private/ChangeCompanyPage/components/ChangeCompanyForm.vue';

export default defineComponent({
  name: 'ChangeCompany',
  components: { ChangeCompanyForm },
});
</script>
