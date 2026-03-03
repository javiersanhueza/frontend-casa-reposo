<template>
  <div class="q-pa-md">
    <div class="row justify-end q-mb-md">
      <q-input
        filled
        dense
        debounce="500"
        v-model="filter"
        placeholder="Buscar usuario..."
        clearable
        prepend-inner-icon="search"
        class="q-mr-sm"
        @clear="filter = ''"
      />
    </div>

    <q-table
      flat
      grid
      :rows="filteredResidences"
      row-key="companyId"
      no-data-label="No hay residencias registradas"
      hide-bottom
      class="bg-transparent"
    >
      <template v-slot:item="props">
        <div class="q-pa-sm col-12 col-sm-6 col-md-4 col-lg-3">
          <q-card
            class="residence-card shadow-3 cursor-pointer"
            @click="openResidenceDetails(props.row)"
          >
            <div
              style="height: 150px; position: relative"
              class="bg-grey-3 flex flex-center overflow-hidden"
            >
              <img
                v-if="props.row.imagen"
                :src="props.row.imagen"
                style="height: 100%; width: 100%; object-fit: cover"
              />

              <q-icon v-else name="apartment" size="80px" color="grey-5" />

              <div class="absolute-top-right q-pa-sm row q-gutter-sm">
                <q-btn
                  round
                  color="white"
                  text-color="primary"
                  icon="edit"
                  size="sm"
                  class="shadow-2"
                  @click.stop="openDialogEdit(props.row)"
                >
                  <q-tooltip>Editar Residencia</q-tooltip>
                </q-btn>

                <q-btn
                  round
                  color="white"
                  text-color="negative"
                  icon="delete"
                  size="sm"
                  class="shadow-2"
                  @click.stop="openDialogDelete(props.row)"
                >
                  <q-tooltip>Eliminar Residencia</q-tooltip>
                </q-btn>
              </div>
            </div>

            <q-card-section>
              <div class="row no-wrap items-center">
                <div class="col text-h6 ellipsis">{{ props.row.name }}</div>
              </div>
              <div class="text-caption text-grey-6 q-mb-xs">
                RUT: {{ props.row.rut }}
              </div>

              <div class="row items-center text-body2 text-grey-8 q-mt-sm">
                <q-icon
                  name="location_on"
                  color="negative"
                  size="18px"
                  class="q-mr-xs"
                />
                <span class="ellipsis"
                  >{{ props.row.commune }}, {{ props.row.region }}</span
                >
              </div>
            </q-card-section>

            <q-separator />

            <q-card-actions class="q-px-md q-py-sm justify-between bg-grey-1">
              <q-chip dense color="blue-1" text-color="blue-8" icon="elderly">
                {{ props.row.residents || 0 }} Residentes
              </q-chip>
              <q-chip dense color="teal-1" text-color="teal-8" icon="badge">
                {{ props.row.employees || 0 }} Empleados
              </q-chip>
              <q-chip
                dense
                color="orange-1"
                text-color="orange-8"
                icon="admin_panel_settings"
              >
                {{ props.row.owners || 0 }} Dueños
              </q-chip>
            </q-card-actions>
          </q-card>
        </div>
      </template>
    </q-table>

    <pagination-controls
      v-if="
        residenceStore.residences &&
        residenceStore.residences.length > 0 &&
        !isLoading
      "
      :model-value="currentPage"
      @update:model-value="changePage"
      :total-page="totalPages"
      :initial-rows-per-page="currentRowsPerPage"
      @rows-per-page-change="changeRowsPerPage"
    />

    <div
      v-else-if="!isLoading"
      class="q-pa-xl flex flex-center column text-grey-7 text-center"
      style="min-height: 200px"
    >
      <q-icon name="info" size="48px" class="q-mb-md" />
      <div class="text-h6">Sin datos disponibles</div>
      <div class="text-subtitle2">
        No se encontraron residencias para mostrar
      </div>
    </div>
  </div>

  <residence-details-dialog
    v-model="detailsDialog"
    :residence="selectedResidence"
    @owner-created="refreshResidence"
  />

  <new-residence
    title="Editar residencia"
    v-model:dialogVisible="dialogVisible"
    is-edit
    :residence-edit="selectedResidence"
    @submitted="handleResidenceUpdate"
  />
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { date, Notify, useQuasar } from 'quasar';

import pinia from 'src/stores';
import PaginationControls from 'pages/private/components/PaginationControls.vue';
import { useResidenceStore } from 'stores/residence';
import NewResidence from 'pages/private/ResidencesPage/components/NewResidence.vue';
import {
  Company,
  NewCompany,
} from 'src/interfaces/companies/companies.interfaces';
import ResidenceDetailsDialog from 'pages/private/ResidencesPage/components/ResidenceDetailsDialog.vue';

export default defineComponent({
  name: 'ResidencesComponent',

  components: { ResidenceDetailsDialog, NewResidence, PaginationControls },

  setup() {
    const residenceStore = useResidenceStore(pinia());
    const filter = ref('');
    const isLoading = ref(false);
    const $q = useQuasar();
    const dialogVisible = ref(false);

    const currentPage = computed({
      get: () => {
        const offset = residenceStore.offset || 0;
        const limit = residenceStore.limit || 10;
        return Math.floor(offset / limit) + 1;
      },
      set: (val) => {
        changePage(val);
      },
    });

    const currentRowsPerPage = computed(() => residenceStore.limit);

    const totalPages = computed(() => residenceStore.totalPage || 0);

    const refreshData = async () => {
      try {
        isLoading.value = true;
        await residenceStore.getResidencesPagination();
      } catch (e) {
        console.error(e);
      } finally {
        isLoading.value = false;
      }
    };

    const changePage = async (newPage: number) => {
      const newOffset = (newPage - 1) * residenceStore.limit;
      residenceStore.$patch({ offset: newOffset });
      await refreshData();
    };

    const changeRowsPerPage = async (newLimit: number) => {
      residenceStore.$patch({
        limit: newLimit,
        offset: 0,
      });
      await refreshData();
    };
    const filteredResidences = computed(() => residenceStore.residences ?? []);

    const getFullName = (row: any) => {
      return `${row.firstName} ${row.secondName || ''} ${row.firstSurname} ${
        row.secondSurname || ''
      }`
        .trim()
        .replace(/\s+/g, ' ');
    };

    const formatDate = (dateString: any) =>
      date.formatDate(dateString, 'DD/MM/YYYY');

    const getActiveRoles = (rolesObj: any) => {
      if (!rolesObj) return [];
      return Object.keys(rolesObj).filter((key) => rolesObj[key] === true);
    };

    const detailsDialog = ref(false);

    const selectedResidence = ref<any>(null);

    const activeTab = ref('residents');

    const openResidenceDetails = async (residence: any) => {
      await residenceStore.getResidence(residence.companyId);
      selectedResidence.value = residenceStore.residence;
      detailsDialog.value = true;
    };

    const refreshResidence = async () => {
      await residenceStore.getResidence(selectedResidence.value.companyId);
      selectedResidence.value = residenceStore.residence;
    };

    const openDialogEdit = async (residence: Company) => {
      await residenceStore.getResidence(residence.companyId);
      selectedResidence.value = residenceStore.residence;
      dialogVisible.value = true;
    };

    const openDialogDelete = (residence: any) => {
      $q.dialog({
        title: 'Confirmar Eliminación',
        message: `¿Estás seguro de que deseas eliminar la residencia <strong>${residence.name}</strong>?<br><br><span class="text-caption text-grey-8">Esta acción no se puede deshacer y podría afectar a los usuarios asociados.</span>`,
        html: true,
        ok: {
          label: 'Eliminar',
          color: 'negative',
          unelevated: true,
          icon: 'delete',
        },
        cancel: {
          label: 'Cancelar',
          color: 'grey-8',
          flat: true,
        },
        persistent: true,
      }).onOk(async () => {
        try {
          const response = await residenceStore.deleteResidence(
            residence.companyId
          );

          if (response) {
            $q.notify({
              type: 'positive',
              message: `La residencia ${residence.name} fue eliminada con éxito.`,
              position: 'top-right',
            });
            await residenceStore.getResidences();
          }
        } catch (error) {
          $q.notify({
            type: 'negative',
            message: 'Ocurrió un error al intentar eliminar la residencia.',
            position: 'top-right',
          });
        }
      });
    };

    const handleResidenceUpdate = async (
      editCompany: NewCompany,
      closeDialog: () => void
    ) => {
      const response = await residenceStore.updateResidence({
        ...editCompany,
        city: editCompany.commune,
      });

      if (response) {
        closeDialog();

        Notify.create({
          type: 'positive',
          message: 'Residencia editada con éxito',
          position: 'top-right',
          timeout: 3000,
        });

        await residenceStore.getResidences();
      }
    };

    onMounted(() => {
      refreshData();
    });

    return {
      filter,
      filteredResidences,
      isLoading,
      currentPage,
      currentRowsPerPage,
      totalPages,
      residenceStore,
      activeTab,
      detailsDialog,
      selectedResidence,
      dialogVisible,

      refreshResidence,
      openResidenceDetails,
      changePage,
      changeRowsPerPage,
      getFullName,
      formatDate,
      getActiveRoles,
      handleResidenceUpdate,
      openDialogEdit,
      openDialogDelete,
    };
  },
});
</script>

<style scoped>
.residence-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.residence-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
}
</style>
