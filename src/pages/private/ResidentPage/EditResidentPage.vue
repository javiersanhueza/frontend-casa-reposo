<template>
  <div class="text-h6 text-grey-7 q-mb-sm">Editar residente</div>

  <q-card class="q-pa-md" flat style="border-radius: 10px">
    <new-resident-form is-edit />
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NewResidentForm from 'pages/private/ResidentPage/components/NewResidentForm.vue';

export default defineComponent({
  name: 'EditResidentPage',

  components: { NewResidentForm },
});
</script>
