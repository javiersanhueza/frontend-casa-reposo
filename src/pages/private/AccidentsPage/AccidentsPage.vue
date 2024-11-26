<template>
  <div class="text-h6 text-grey-7 q-mb-sm">Accidentes</div>

  <q-card flat style="border-radius: 10px">
    <q-card-section class="text-right">
      <q-btn label="Registrar accidente" class="background-header" text-color="white" />
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AccidentsPage'
})
</script>
