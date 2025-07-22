<template>
  <q-dialog v-model="internalDialog" persistent>
    <q-card class="q-dialog-plugin">
      <q-card-section class="row items-center">
        <div class="text-h6 text-grey-8">Detalle residente</div>
        <q-space />
        <q-btn flat round dense icon="close" @click="internalDialog = false" />
      </q-card-section>

      <q-card-section class="text-grey-9">
        <!-- Datos personales -->
        <div class="text-subtitle2 text-primary q-mb-sm">Datos Personales</div>
        <div><strong>Nombre completo:</strong> {{ resident.name }} {{ resident.paternalSurname }} {{ resident.maternalSurname }}</div>
        <div><strong>RUT:</strong> {{ resident.rut }}</div>
        <div><strong>Fecha de nacimiento:</strong> {{ formatDate(resident.birthDate) }}</div>
        <div><strong>Dirección:</strong> {{ resident.address }}</div>
        <div><strong>Religión:</strong> {{ resident.religion?.description || 'No especificada' }}</div>
        <div><strong>Profesión:</strong> {{ resident.profession?.description || 'No especificada' }}</div>

        <q-separator class="q-my-md" v-if="resident.retirementDate"/>

        <!-- Información clínica -->
        <div class="text-subtitle2 text-primary q-mb-sm" v-if="resident.retirementDate">Retiro</div>
        <div><strong>Fecha de retiro:</strong> {{ resident.retirementDate ? formatDate(resident.retirementDate) : 'No retirado' }}</div>
        <div><strong>Motivo de retiro:</strong> {{ resident.retirementReason || 'N/A' }}</div>

        <q-separator class="q-my-md" />

        <!-- Apoderado principal -->
        <div class="text-subtitle2 text-secondary q-mb-sm">Apoderado Principal</div>
        <div><strong>Nombre:</strong> {{ resident.principalGuardian.name }} {{ resident.principalGuardian.paternalSurname }} {{ resident.principalGuardian.maternalSurname }}</div>
        <div><strong>RUT:</strong> {{ resident.principalGuardian.rut }}</div>
        <div><strong>Teléfono:</strong> {{ resident.principalGuardian.phone }}</div>
        <div><strong>Dirección:</strong> {{ resident.principalGuardian.address }}</div>

        <q-separator class="q-my-md" />

        <!-- Apoderado secundario -->
        <div class="text-subtitle2 text-secondary q-mb-sm">Apoderado Secundario</div>
        <div><strong>Nombre:</strong> {{ resident.secondaryGuardian.name }} {{ resident.secondaryGuardian.paternalSurname }} {{ resident.secondaryGuardian.maternalSurname }}</div>
        <div><strong>RUT:</strong> {{ resident.secondaryGuardian.rut }}</div>
        <div><strong>Teléfono:</strong> {{ resident.secondaryGuardian.phone }}</div>
        <div><strong>Dirección:</strong> {{ resident.secondaryGuardian.address }}</div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

import { globalMixin } from 'src/mixins/globalMixin';

export default defineComponent({
  name: 'PreviewResidentDialog',

  mixins: [globalMixin],

  props: {
    showDialog: {
      type: Boolean,
      required: true
    },
    title: {
      type: String
    },
    text: {
      type: String
    },
    resident: {
      type: Object,
      required: true
    }
  },

  emits: ['update:showDialog', 'accept'],

  setup(props, { emit }) {
    const internalDialog = ref(props.showDialog);

    watch(() => props.showDialog, (newVal) => {
      internalDialog.value = newVal;
    });

    watch(internalDialog, (newVal) => {
      emit('update:showDialog', newVal);
    });

    const actionAccept = () => {
      emit('accept');
    }

    return {
      internalDialog,
      actionAccept
    }
  }
})
</script>
