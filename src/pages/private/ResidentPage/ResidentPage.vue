<template>
  <div class="text-h6 text-grey-7 q-mb-sm">Residentes</div>

  <q-card class="q-pa-md" flat style="border-radius: 10px">
    <q-card-section>
      <residents-table />
    </q-card-section>
  </q-card>

  <div>
    <!--
    <q-input
      filled
      type="textarea"
      label="Transcripción"
      v-model="transcriptText"
      class="q-mt-md"
      autogrow
    >
      <template v-slot:append>
        <q-btn @click="startListening" label="🎤 Hablar" color="primary" />
        <q-btn @click="stopListening" label="🛑 Detener" color="negative" />
        <q-btn @click="clearTranscript" label="🧹 Limpiar" color="grey-7" class="q-ml-sm" />

        <q-spinner-bars
          color="primary"
          size="2em"
          v-if="isListening"
        />
      </template>
    </q-input>
    -->
  </div>

  <q-page-sticky position="bottom-right" :offset="[18, 18]">
    <q-tooltip anchor="center left" self="center right" :offset="[10, 10]">
      Nuevo residente
    </q-tooltip>
    <q-btn
      @click="router.push({ name: 'NewResidentPage' })"
      fab
      icon="add"
      color="primary"
    />
  </q-page-sticky>

  <!--

  <new-company-dialog
    title="Nueva Empresa"
    v-model:showDialog="showDialog"
    @accept="getResidents"
  />
  -->
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue';

import { useResidentStore } from 'stores/resident';
import pinia from 'src/stores';
import { useSpeechRecognition } from 'src/composables/useSpeechRecognition';
import { useRouter } from 'vue-router';
import ResidentsTable from 'pages/private/ResidentPage/components/Residents.vue';

export default defineComponent({
  name: 'ResidentPage',
  components: { ResidentsTable },

  setup() {
    const showDialog = ref(false);
    const residentStore = useResidentStore(pinia());
    const residents = ref([]);
    const router = useRouter();

    const transcriptText = ref('');
    const speech = useSpeechRecognition();

    const transcript = computed(() => speech?.transcript.value ?? '');
    const isListening = computed(() => speech?.isListening.value ?? false);
    const startListening = () => speech?.startListening();
    const stopListening = () => speech?.stopListening();
    const clearTranscript = () => speech?.clearTranscript();

    watch(transcript, (newVal) => {
      transcriptText.value = newVal;
    });

    const getResidents = async () => {
      await residentStore.getResidentsForCompany();
      residents.value = residentStore.residents || [];
    };

    onMounted(() => {
      getResidents();
    });

    return {
      showDialog,
      residents,
      transcript,
      transcriptText,
      isListening,
      router,

      getResidents,
      startListening,
      stopListening,
      clearTranscript,
    };
  },
});
</script>
