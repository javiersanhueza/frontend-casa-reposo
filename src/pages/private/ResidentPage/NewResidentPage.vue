<template>
  <q-page>
    <div class="text-h6 text-grey-7 q-mb-sm">Nuevo residente</div>

    <q-card class="q-pa-md" flat style="border-radius: 10px">
      <new-resident-form />
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NewResidentForm from 'pages/private/ResidentPage/components/NewResidentForm.vue';

export default defineComponent({
  name: 'NewResidentPage',

  components: { NewResidentForm },
});
</script>
