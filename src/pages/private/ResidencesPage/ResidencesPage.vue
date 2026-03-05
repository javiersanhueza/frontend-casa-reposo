<template>
  <q-page class="q-pa-md">
    <div class="text-h6 text-grey-7 q-mb-sm">Residencias</div>

    <q-card class="q-pa-md shadow-2" style="border-radius: 10px">
      <q-card-section>
        <residences-component />
      </q-card-section>
    </q-card>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn @click="dialogVisible = true" fab icon="add" color="primary">
        <q-tooltip
          v-if="!$q.screen.xs"
          anchor="center left"
          self="center middle"
          :offset="[55, 55]"
        >
          Nuevo residencia
        </q-tooltip>
      </q-btn>
    </q-page-sticky>

    <new-residence
      title="Nueva residencia"
      v-model:dialogVisible="dialogVisible"
      @submitted="handleResidenceCreate"
    />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { Notify } from 'quasar';

import pinia from 'src/stores';
import { useOptionStore } from 'stores/option';
import { NewCompany } from 'src/interfaces/companies/companies.interfaces';
import { useResidenceStore } from 'stores/residence';

import ResidencesComponent from 'pages/private/ResidencesPage/components/ResidencesComponent.vue';
import NewResidence from 'pages/private/ResidencesPage/components/NewResidence.vue';

export default defineComponent({
  name: 'ResidencesPage',

  components: { NewResidence, ResidencesComponent },

  setup() {
    const dialogVisible = ref(false);
    const residenceStore = useResidenceStore(pinia());
    const optionStore = useOptionStore(pinia());

    const handleResidenceCreate = async (newCompany: NewCompany, closeDialog: () => void) => {
      const response = await residenceStore.createResidence({
        ...newCompany,
        city: newCompany.commune,
        dateStart: new Date().toISOString()
      });

      if (response) {
        closeDialog();

        Notify.create({
          type: 'positive',
          message: 'Residencia creada con éxito',
          position: 'top-right',
          timeout: 3000,
        });

        await residenceStore.getResidences();
      }
    };

    onMounted(async () => {
      await optionStore.getComunasRegiones();
    });

    return {
      dialogVisible,

      handleResidenceCreate,
    };
  },
});
</script>
