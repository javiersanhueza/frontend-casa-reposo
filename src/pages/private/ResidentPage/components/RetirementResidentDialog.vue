<template>
  <q-dialog v-model="internalDialog" persistent>
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="text-h6 text-grey-7 q-mr-lg">Retirar residente</div>
      </q-card-section>

      <q-form @submit="onSubmit">
        <q-card-section class="text-grey-9 q-gutter-y-md">
          <q-input
            dense
            label="Fecha retiro (*)"
            v-model="retirement.date"
            mask="##/##/####"
            :rules="[(val: string) => !!val || 'Campo requerido']"
            outlined
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale" anchor="top right" self="top left">
                  <q-date
                    v-model="retirement.date"
                    mask="DD/MM/YYYY"
                    format="DD/MM/YYYY"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Cerrar" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

          <q-input
            v-model="retirement.reason"
            label="Motivo retiro"
            outlined
            dense
            autogrow
          />

        </q-card-section>

        <q-card-actions align="right" class="q-pa-md row no-wrap items-center" :class="{'dialog-actions': $q.screen.xs}" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
          <q-btn outline label="Cancelar" color="primary" text-color="primary" @click="internalDialog = false" />
          <q-btn unelevated label="Aceptar" text-color="white" color="primary" type="submit" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

import { useResidentStore } from 'stores/resident';
import { Notify } from 'quasar';

export default defineComponent({
  name: 'RetirementResidentDialog',

  props: {
    showDialog: {
      type: Boolean,
      required: true
    },
    resident: {
      type: Object,
      required: true
    }
  },

  emits: ['update:showDialog'],

  setup(props, { emit }) {
    const internalDialog = ref(props.showDialog);
    const residentStore = useResidentStore();
    const retirement = ref({
      date: '',
      reason: ''
    });

    watch(() => props.showDialog, (newVal) => {
      internalDialog.value = newVal;
    });

    watch(internalDialog, (newVal) => {
      emit('update:showDialog', newVal);
    });

    const onSubmit = async () => {
      const response = await residentStore.retirementResident(props.resident.id, retirement.value.date, retirement.value.reason);

      if (!!response?.resident) {
        Notify.create({
          type: 'positive',
          message: response.message,
          position: 'top',
          timeout: 3000
        });
        await residentStore.getResidentsForCompany();
        internalDialog.value = false;

      }
    }

    return {
      internalDialog,
      retirement,

      onSubmit
    }
  }

})
</script>
