<template>
  <q-btn
    flat
    color="primary"
    icon="arrow_back"
    label="Volver"
    @click="$router.push({ name: 'ResidentPage' })"
  />

  <div class="row q-mt-md">
    <div :class="['col-sm-4 col-12', screen.gt.sm ? 'q-pr-md' : '']">
      <q-card class="text-center" style="flex: 1; border-radius: 10px">
        <q-card-section>
          <q-avatar size="80px" v-if="resident?.photo">
            <img
              :src="resident.photo"
              alt="Foto del residente"
              style="border-radius: 50%"
            />
          </q-avatar>
          <q-avatar
            v-else
            size="80px"
            color="grey-7"
            text-color="grey-5"
            icon="account_circle"
            font-size="80px"
          />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="text-h6 text-primary">
            {{ resident?.name }} {{ resident?.paternalSurname }}
            {{ resident?.maternalSurname }}
          </div>

          <div class="q-mt-sm">
            <div class="text-grey-7">
              <strong>RUT:</strong>
            </div>
            <div class="text-grey-7">
              <strong>Fecha de nacimiento:</strong>
              {{
                resident?.birthDate
                  ? formatDate(resident.birthDate)
                  : 'No disponible'
              }}
            </div>
            <div class="text-grey-7">
              <strong>Edad:</strong>
              {{
                resident?.birthDate
                  ? calculateAge(resident.birthDate) + ' años'
                  : 'No disponible'
              }}
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div :class="['col-sm-8 col-12', screen.gt.sm ? '' : 'q-mt-md']">
      <q-card class="q-pa-md" style="border-radius: 10px">
        <q-card-section class="row items-center justify-between">
          <div class="text-h6 text-primary">Antecedentes clínicos</div>
          <q-btn
            flat
            icon="edit_square"
            color="secondary"
            @click="openDialog()"
          >
            <q-tooltip>Editar</q-tooltip>
          </q-btn>
        </q-card-section>

        <q-separator />

        <q-card-section class="q-gutter-md">
          <div class="text-grey-7">
            <strong>Enfermedades crónicas:</strong>
            {{ clinicalHistory?.chronicDiseases || 'No disponible' }}
          </div>
          <div class="text-grey-7">
            <strong>Medicamentos:</strong>
            {{ clinicalHistory?.medications || 'No disponible' }}
          </div>
          <div class="text-grey-7">
            <strong>Fracturas:</strong>
            {{ clinicalHistory?.fractures || 'No disponible' }}
          </div>
          <div class="text-grey-7">
            <strong>Cirugías:</strong>
            {{ clinicalHistory?.surgeries || 'No disponible' }}
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="row q-col-gutter-md">
            <!-- Hábitos -->
            <div class="col-6">
              <div class="text-subtitle2 text-grey-8 q-mb-sm">
                <strong>Hábitos</strong>
              </div>
              <div class="q-pl-sm">
                <div class="text-grey-7 q-mb-xs">
                  <strong>Tabaco:</strong>
                  {{
                    clinicalHistory?.tobacco === true
                      ? 'Si'
                      : clinicalHistory?.tobacco === false
                      ? 'No'
                      : 'No disponible'
                  }}
                </div>
                <div class="text-grey-7 q-mb-xs">
                  <strong>Alcohol:</strong>
                  {{
                    clinicalHistory?.alcohol === true
                      ? 'Si'
                      : clinicalHistory?.alcohol === false
                      ? 'No'
                      : 'No disponible'
                  }}
                </div>
                <div class="text-grey-7">
                  <strong>Otros:</strong>
                  {{ clinicalHistory?.otherHabits || 'No disponible' }}
                </div>
              </div>
            </div>

            <!-- Peso, Estatura, IMC -->
            <div class="col-6">
              <div class="text-subtitle2 text-grey-8 q-mb-sm">
                <strong>Datos físicos</strong>
              </div>
              <div class="q-pl-sm">
                <div class="text-grey-7 q-mb-xs">
                  <strong>Peso:</strong>
                  {{
                    clinicalHistory?.weight
                      ? clinicalHistory.weight + ' kg'
                      : 'No disponible'
                  }}
                </div>
                <div class="text-grey-7 q-mb-xs">
                  <strong>Estatura:</strong>
                  {{
                    clinicalHistory?.stature
                      ? clinicalHistory.stature + ' cm'
                      : 'No disponible'
                  }}
                </div>
                <div class="text-grey-7">
                  <strong>IMC:</strong>
                  {{ calculateBMI() ? calculateBMI() : 'No disponible' }}
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card class="q-pa-md q-mt-md" style="border-radius: 10px">
        <q-card-section>
          <file-attachment-clinical-history />
        </q-card-section>
      </q-card>
    </div>
  </div>

  <clinical-history-dialog
    v-model:show-dialog="showDialogClinicalHistory"
    :clinical-history-edit="clinicalHistory"
  />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { useResidentStore } from 'stores/resident';
import pinia from 'src/stores';
import { NewResident } from 'src/interfaces/residents.interface';
import { globalMixin } from 'src/mixins/globalMixin';
import { useQuasar } from 'quasar';
import ClinicalHistoryDialog from 'pages/private/ClinicalHistoryPage/components/ClinicalHistoryDIalog.vue';
import { useClinicalHistoryStore } from 'stores/clinicalHistory';
import FileAttachmentClinicalHistory from 'pages/private/ClinicalHistoryPage/components/FilesAttachmentClinicalHistory.vue';

export default defineComponent({
  name: 'ClinicalHistory',
  components: { FileAttachmentClinicalHistory, ClinicalHistoryDialog },

  mixins: [globalMixin],

  setup() {
    const route = useRoute();
    const { screen } = useQuasar();
    const idResident = route.params.idResident;
    const residentStore = useResidentStore(pinia());
    const clinicalHistoryStore = useClinicalHistoryStore(pinia());
    const isEditing = ref(false);
    const showDialogClinicalHistory = ref(false);

    const resident = ref<NewResident | null>(null);

    const calculateBMI = () => {
      const weight = clinicalHistory?.value?.weight;
      const heightCm = clinicalHistory?.value?.stature;
      if (weight !== null && heightCm !== null && weight > 0 && heightCm > 0) {
        const heightM = heightCm / 100;
        return +(weight / (heightM * heightM)).toFixed(1);
      } else {
        return null;
      }
    };

    const getResidentByIdAndClinicalHistory = async () => {
      resident.value = await residentStore.getResidentById(Number(idResident));
      await clinicalHistoryStore.getClinicalHistoryForResident(
        Number(idResident)
      );
    };

    const clinicalHistory = computed(
      () => clinicalHistoryStore.clinicalHistory ?? []
    );

    const openDialog = () => {
      showDialogClinicalHistory.value = true;
    };

    onMounted(async () => {
      await getResidentByIdAndClinicalHistory();
    });

    return {
      resident,
      isEditing,
      clinicalHistory,
      screen,
      showDialogClinicalHistory,
      clinicalHistoryStore,

      calculateBMI,
      openDialog,
    };
  },
});
</script>
