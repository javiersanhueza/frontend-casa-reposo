<template>
  <div class="row justify-end q-mx-xs">
    <div :class="['col-sm-2 col-12', screen.gt.sm ? 'q-pr-sm' : '']">
      <q-select
        filled
        dense
        debounce="300"
        v-model="state"
        label="Estado"
        prepend-inner-icon="search"
        :options="stateOptions"
        emit-value
        map-options
      />
    </div>
    <div class="col-sm-4 col-12">
      <q-input
        filled
        dense
        debounce="300"
        v-model="search"
        label="Buscar por nombre o RUT"
        clearable
        prepend-inner-icon="search"
        @clear="search = ''"
      />
    </div>
  </div>

  <q-table
    flat
    bordered
    :rows="filteredResidents ?? []"
    :columns="columnsResident"
    row-key="companyName"
    v-model:pagination="pagination"
    hide-pagination
    grid
    no-data-label="Sin datos disponibles"
  >
    <template v-slot:item="props">
      <div class="col-sm-6 col-12 q-my-sm q-px-xs">
        <q-card flat bordered style="height: 100%">
          <q-card-section horizontal>

            <!-- Imagen del residente -->
            <q-card-section class="q-pr-none" style="width: 100px; display: flex; align-items: center; justify-content: center;">
              <q-avatar color="grey-5" size="80px">
                <img v-if="props.row.photo" :src="props.row.photo" alt="Foto del residente" style="border-radius: 50%"/>
                <q-icon v-else name="person" size="80px" color="grey-7" />
              </q-avatar>
            </q-card-section>

            <!-- Información del residente -->
            <q-card-section class="col">
              <div class="text-h6 text-primary">
                {{ props.row.name }} {{ props.row.paternalSurname }} {{ props.row.maternalSurname }}
              </div>
              <div class="text-caption text-grey-7">
                <strong>RUT:</strong> {{ props.row.rut }}
              </div>
              <div class="text-caption text-grey-7">
                <strong>Fecha de nacimiento:</strong> {{ formatDate(props.row.birthDate) }}
              </div>
              <div class="text-caption text-grey-7">
                <strong>Edad:</strong> {{ calculateAge(props.row.birthDate) }} años
              </div>
            </q-card-section>

            <!-- Estado -->
            <q-card-section vertical>
              <q-chip
                v-if="!props.row.retirementDate"
                color="green"
                text-color="white"
                size="12px"
              >
                Activo
              </q-chip>
              <q-chip v-else color="red" text-color="white" size="12px">
                Retirado
              </q-chip>
            </q-card-section>

            <!-- Acciones -->
            <q-separator vertical />
            <q-card-actions vertical class="justify-around">
              <q-btn flat round icon="preview" color="secondary" @click="previewResident(props.row)">
                <q-tooltip v-if="screen.gt.sm" anchor="top middle" self="top middle">
                  Ver residente
                </q-tooltip>
              </q-btn>
              <q-btn dense round flat color="secondary" icon="more_vert">
                <q-tooltip v-if="screen.gt.sm" anchor="top middle" self="top middle">
                  Más acciones
                </q-tooltip>
                <q-menu fit anchor="bottom right" self="top right">
                  <q-list bordered>
                    <q-item
                      clickable
                      v-ripple
                      @click="router.push({ name: 'EditResidentPage', params: { idResident: props.row.id } })"
                      v-close-popup
                      v-if="!props.row.retirementDate"
                    >
                      <q-item-section avatar>
                        <q-icon color="secondary" name="edit" />
                      </q-item-section>
                      <q-item-section class="text-grey-7 text-subtitle2">
                        Editar
                      </q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      v-ripple
                      v-close-popup
                      @click="openRetirement(props.row)"
                      v-if="!props.row.retirementDate"
                    >
                      <q-item-section avatar>
                        <q-icon color="secondary" name="exit_to_app" />
                      </q-item-section>
                      <q-item-section class="text-grey-7 text-subtitle2">
                        Retirar
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </q-card-actions>
          </q-card-section>
        </q-card>
      </div>
    </template>

  </q-table>
  <div class="row justify-center q-mt-md">
    <q-pagination
      v-model="pagination.page"
      color="grey-8"
      :max="pagesNumber"
      size="sm"
      v-if="pagesNumber > 1"
    />
  </div>

  <retirement-resident-dialog
    v-model:show-dialog="showDialogRetirement"
    :resident="selectedResident"
  />

  <preview-resident-dialog
    v-model:show-dialog="showDialogPreview"
    :resident="selectedResident"
  />
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

import { useResidentStore } from 'stores/resident';
import pinia from 'src/stores';
import { globalMixin } from 'src/mixins/globalMixin';
import RetirementResidentDialog from 'pages/private/ResidentPage/components/RetirementResidentDialog.vue';
import PreviewResidentDialog from 'pages/private/ResidentPage/components/PreviewResidentDialog.vue';

export default defineComponent({
  name: 'ResidentsTable',

  components: { PreviewResidentDialog, RetirementResidentDialog },

  mixins: [globalMixin],

  setup() {
    const showDialogRetirement = ref(false);
    const showDialogPreview = ref(false);
    const residentStore = useResidentStore(pinia());
    const search = ref('');
    const state = ref('active');
    const router = useRouter();
    const { screen } = useQuasar();

    const stateOptions = [
      { value: 'all', label: 'Todos' },
      { value: 'retired', label: 'Retirado' },
      { value: 'active', label: 'Activo' },
    ]

    const filteredResidents = computed(() => {
      const term = search.value.toLowerCase();

      return (
        residentStore.residents?.filter((resident: any) => {
          const fullName = `${resident.name} ${
            resident.paternalSurname ?? ''
          } ${resident.maternalSurname ?? ''}`.toLowerCase();
          return (
            fullName.includes(term) || resident.rut.toLowerCase().includes(term)
          );
        }) ?? []
      );
    });

    const residents = computed(() => residentStore.residents ?? []);

    const selectedResident = ref({});
    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 10,
    });

    const columnsResident = [
      {
        name: 'residentName',
        required: true,
        label: 'Nombre',
        align: 'left' as const,
        field: 'name',
        sortable: true,
      },
      {
        name: 'rut',
        align: 'center' as const,
        label: 'Rut',
        field: 'rut',
        sortable: true,
      },
      {
        name: 'age',
        label: 'Edad',
        field: 'age',
        sortable: true,
      },
      {
        name: 'actions',
        label: 'Acciones',
        align: 'center' as const,
        field: 'actions',
        sortable: false,
      },
    ];

    const openRetirement = (resident: any) => {
      selectedResident.value = resident;
      showDialogRetirement.value = true;
    };

    const previewResident = (resident: any) => {
      selectedResident.value = resident;
      showDialogPreview.value = true;
    };

    watch(state, async (newVal) => {
      await residentStore.getResidentsForCompany(newVal);
    });


    return {
      columnsResident,
      pagination,
      showDialogPreview,
      showDialogRetirement,
      selectedResident,
      residents,
      search,
      filteredResidents,
      router,
      screen,
      stateOptions,
      state,

      pagesNumber: computed(() =>
        Math.ceil(residents!.value.length / pagination.value.rowsPerPage)
      ),
      openRetirement,
      previewResident
    };
  },
});
</script>
