<template>
  <q-page>
    <q-card class="q-pa-md" flat style="border-radius: 10px">
      <q-card-section>
        <clinical-history />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ClinicalHistory from 'pages/private/ClinicalHistoryPage/components/ClinicalHistory.vue';

export default defineComponent({
  name: 'ClinicalHistoryPage',
  components: { ClinicalHistory },
});
</script>
