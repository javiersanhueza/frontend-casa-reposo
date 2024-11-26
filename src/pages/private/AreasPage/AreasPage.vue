<template>
  <div class="text-h6 text-grey-7 q-mb-sm">Áreas</div>

  <q-card class="q-pa-md" flat style="border-radius: 10px">
    <q-card-section class="text-right">
      <q-btn
        label="Crear área"
        class="background-header"
        text-color="white"
        @click="showDialog = true"
      />
    </q-card-section>

    <q-card-section>
      <areas-company
        :areas="areas"
        @get-areas="getAreas"
      />
    </q-card-section>
  </q-card>

  <new-areas-dialog
    title="Nueva Área"
    v-model:showDialog="showDialog"
    @accept="getAreas"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

import AreasCompany from 'pages/private/AreasPage/components/AreasCompany.vue';
import NewAreasDialog from 'pages/private/AreasPage/components/NewAreaDialog.vue';
import { useAreaStore } from 'stores/area';
import pinia from 'src/stores';
import { Area } from 'src/interfaces/areas.interface';

export default defineComponent({
  name: 'AreasPage',
  components: { NewAreasDialog, AreasCompany },

  setup() {
    const showDialog = ref(false);
    const areaStore = useAreaStore(pinia());
    const areas = ref<Area[]>([]);

    const getAreas = async () => {
      await areaStore.getAreasForCompany();
      areas.value = areaStore.areas || [];
    };

    onMounted(() => {
      if (!areaStore?.areas?.length) {
        getAreas();
      } else {
        areas.value = areaStore.areas || [];
      }
    })

    return {
      showDialog,
      areas,

      getAreas
    }
  }
});
</script>
