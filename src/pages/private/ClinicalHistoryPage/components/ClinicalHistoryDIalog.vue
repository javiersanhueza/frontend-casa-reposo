<template>
  <q-dialog v-model="internalDialog" persistent>
    <q-card class="q-dialog-plugin">
      <q-card-section class="row items-center">
        <div class="row items-center justify-between">
          <div class="text-h6 text-grey-7">Antecedentes clínicos</div>
        </div>
      </q-card-section>

      <q-form @submit="submitForm">
        <q-card-section class="q-gutter-md">
          <q-input
            dense
            outlined
            v-model="form.chronicDiseases"
            label="Enfermedades Crónicas"
          />
          <q-input
            dense
            outlined
            v-model="form.medications"
            label="Medicamentos"
          />
          <q-input dense outlined v-model="form.fractures" label="Fracturas" />
          <q-input dense outlined v-model="form.surgeries" label="Cirugías" />

          <div class="row">
            <div class="col-xs-12 text-subtitle2">Datos físicos</div>
            <div :class="['col-sm-6 col-12', screen.gt.sm ? 'q-pr-sm' : '']">
              <q-input
                dense
                outlined
                v-model.number="form.weight"
                label="Peso (kg)"
                type="number"
              />
            </div>
            <div
              :class="['col-sm-6 col-12', screen.gt.sm ? 'q-pr-sm' : 'q-mt-md']"
            >
              <q-input
                dense
                outlined
                v-model.number="form.stature"
                label="Estatura (cm)"
                type="number"
              />
            </div>

            <div class="col-12 q-mt-md">
              <q-input
                dense
                outlined
                v-model="bmiDisplay"
                label="IMC (Índice de Masa Corporal)"
                readonly
              />
            </div>
          </div>

          <div class="row">
            <div class="col-xs-12 text-subtitle2">Hábitos</div>
            <div class="col-md-4 col-xs-12">
              <q-toggle v-model="form.tobacco" label="Tabaco" />
            </div>
            <div class="col-md-4 col-xs-12">
              <q-toggle v-model="form.alcohol" label="Alcohol" />
            </div>
            <div class="col-md-4 col-xs-12">
              <q-toggle v-model="form.others" label="Otros" />
            </div>
          </div>

          <q-input
            dense
            outlined
            v-model="form.otherHabits"
            label="Otros Hábitos"
            v-if="form.others"
          />
        </q-card-section>

        <q-card-actions
          align="right"
          class="q-pa-md row no-wrap items-center"
          :class="{ 'dialog-actions': $q.screen.xs }"
          style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px"
        >
          <q-btn
            outline
            label="Cancelar"
            color="white"
            text-color="primary"
            @click="internalDialog = false"
          />
          <q-btn
            unelevated
            label="Aceptar"
            color="primary"
            text-color="white"
            type="submit"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
import { Notify, useQuasar } from 'quasar';
import { useClinicalHistoryStore } from 'stores/clinicalHistory';
import pinia from 'src/stores';
import { useRoute } from 'vue-router';

interface FormClinicalHistory {
  chronicDiseases: string | null,
  medications: string | null,
  fractures: string | null,
  surgeries: string | null,
  tobacco: boolean,
  alcohol: boolean,
  others: boolean,
  otherHabits: string | null,
  weight: number | null,
  stature: number | null
}

export default defineComponent({
  name: 'ClinicalHistoryDialog',

  props: {
    showDialog: {
      type: Boolean,
      required: true
    },

    clinicalHistoryEdit: {
      type: Object
    }
  },

  emits: ['update:showDialog'],

  setup(props, { emit }) {
    const { screen } = useQuasar();
    const internalDialog = ref(props.showDialog);
    const clinicalHistoryStore = useClinicalHistoryStore(pinia());
    const route = useRoute();

    const form = ref<FormClinicalHistory>({
      chronicDiseases: null,
      medications: null,
      fractures: null,
      surgeries: null,
      tobacco: false,
      alcohol: false,
      others: false,
      otherHabits: null,
      weight: null,
      stature: null
    })

    const bmiDisplay = computed({
      get: () => {
        return bmi.value !== null ? bmi.value.toString() : ''
      },
      set: () => {}
    })

    const bmi = ref<number | null>(null)

    watch(
      () => [form.value.weight, form.value.stature],
      ([weight, heightCm]) => {
        if (
          weight !== null &&
          heightCm !== null &&
          weight > 0 &&
          heightCm > 0
        ) {
          const heightM = heightCm / 100
          bmi.value = +(weight / (heightM * heightM)).toFixed(1)
        } else {
          bmi.value = null
        }
      },
      { immediate: true }
    );

    watch(() => props.showDialog, (newVal) => {
      console.log(props.clinicalHistoryEdit);
      const isEmpty = !props.clinicalHistoryEdit || Object.keys(props.clinicalHistoryEdit).length === 0

      if (!isEmpty) {
        const other = !!props.clinicalHistoryEdit.otherHabits;
        form.value = ({
          chronicDiseases: props.clinicalHistoryEdit.chronicDiseases,
          medications: props.clinicalHistoryEdit.medications,
          fractures: props.clinicalHistoryEdit.fractures,
          others: other,
          otherHabits: props.clinicalHistoryEdit.otherHabits,
          surgeries: props.clinicalHistoryEdit.surgeries,
          weight: props.clinicalHistoryEdit.weight,
          stature: props.clinicalHistoryEdit.stature,
          tobacco: props.clinicalHistoryEdit.tobacco,
          alcohol: props.clinicalHistoryEdit.alcohol,
        });
        console.log('aqui');
      }
      internalDialog.value = newVal;
    });

    watch(internalDialog, (newVal) => {
      emit('update:showDialog', newVal);
    });

    const submitForm  = async () => {
      const isEmpty = !props.clinicalHistoryEdit || Object.keys(props.clinicalHistoryEdit).length === 0
      if (!isEmpty) {
        // Editar
        const clinicalHistoryId = props.clinicalHistoryEdit.id;

        const otherHabits = form.value.others ? form.value.otherHabits : null;
        const response = await clinicalHistoryStore.editClinicalHistory(
          clinicalHistoryId,
          { ...form.value, otherHabits }
        );

        if (response) {
          Notify.create({
            type: 'positive',
            message: 'Antecedentes clínicos actualizados con éxito',
            position: 'top',
            timeout: 3000
          });

          await clinicalHistoryStore.getClinicalHistoryForResident(props.clinicalHistoryEdit.residentId);
          internalDialog.value = false;
        }
      } else {
        // Crear
        const otherHabits = form.value.others ? form.value.otherHabits : null;
        const residentId = route.params.idResident;
        const response = await clinicalHistoryStore.createClinicalHistory(
          { ...form.value, otherHabits, residentId }
        );

        if (response) {
          Notify.create({
            type: 'positive',
            message: 'Antecedentes clínicos creados con éxito',
            position: 'top',
            timeout: 3000
          });

          await clinicalHistoryStore.getClinicalHistoryForResident(Number(residentId));
          internalDialog.value = false;
        }
      }
    }

    return {
      screen,
      form,
      internalDialog,
      bmiDisplay,

      submitForm
    }
  }

})
</script>
