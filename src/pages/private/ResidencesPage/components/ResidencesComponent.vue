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
          <q-card class="residence-card shadow-3 cursor-pointer" @click="openResidenceDetails(props.row)">

            <div style="height: 150px; position: relative;" class="bg-grey-3 flex flex-center overflow-hidden">

              <img
                v-if="props.row.imagen"
                :src="props.row.imagen"
                style="height: 100%; width: 100%; object-fit: cover;"
              >

              <q-icon
                v-else
                name="apartment"
                size="80px"
                color="grey-5"
              />

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
                <q-icon name="location_on" color="negative" size="18px" class="q-mr-xs" />
                <span class="ellipsis">{{ props.row.commune }}, {{ props.row.city }}</span>
              </div>
            </q-card-section>

            <q-separator />

            <q-card-actions class="q-px-md q-py-sm justify-between bg-grey-1">
              <q-chip dense color="blue-1" text-color="blue-8" icon="elderly">
                {{ props.row.listResidents?.length || 0 }} Residentes
              </q-chip>
              <q-chip dense color="teal-1" text-color="teal-8" icon="badge">
                {{ props.row.listEmployees?.length || 0 }} Empleados
              </q-chip>
              <q-chip dense color="orange-1" text-color="orange-8" icon="admin_panel_settings">
                {{ props.row.listOwners?.length || 0 }} Dueños
              </q-chip>
            </q-card-actions>
          </q-card>
        </div>
      </template>
    </q-table>

    <q-dialog v-model="detailsDialog" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card class="bg-grey-2" v-if="selectedResidence">

        <q-toolbar class="bg-primary text-white shadow-2">
          <q-btn flat v-close-popup round dense icon="arrow_back" />
          <q-toolbar-title>
            Detalles de: <strong>{{ selectedResidence.name }}</strong>
          </q-toolbar-title>
        </q-toolbar>

        <q-card-section class="q-pa-md">
          <div class="row q-col-gutter-lg">

            <div class="col-12 col-md-4">
              <q-card flat bordered class="shadow-1 q-mb-md">
                <q-card-section>
                  <div class="text-h6 q-mb-md">Información General</div>

                  <q-list dense>
                    <q-item>
                      <q-item-section avatar><q-icon color="primary" name="tag" /></q-item-section>
                      <q-item-section><q-item-label caption>RUT</q-item-label><q-item-label>{{ selectedResidence.rut }}</q-item-label></q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section avatar><q-icon color="primary" name="event" /></q-item-section>
                      <q-item-section><q-item-label caption>Fecha Inicio</q-item-label><q-item-label>{{ formatDate(selectedResidence.dateStart) }}</q-item-label></q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section avatar><q-icon color="primary" name="description" /></q-item-section>
                      <q-item-section><q-item-label caption>Descripción</q-item-label><q-item-label>{{ selectedResidence.description }}</q-item-label></q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section avatar><q-icon color="primary" name="map" /></q-item-section>
                      <q-item-section>
                        <q-item-label caption>Dirección</q-item-label>
                        <q-item-label>{{ selectedResidence.address }}</q-item-label>
                        <q-item-label caption>{{ selectedResidence.commune }}, {{ selectedResidence.city }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>

                <q-card-section class="q-pt-none" v-if="selectedResidence.mapUrl">
                  <iframe
                    width="100%"
                    height="200"
                    style="border:0; border-radius: 8px;"
                    loading="lazy"
                    :src="selectedResidence.mapUrl"
                  ></iframe>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-12 col-md-8">
              <q-card flat bordered class="shadow-1">
                <q-tabs
                  v-model="activeTab"
                  dense
                  class="text-grey"
                  active-color="primary"
                  indicator-color="primary"
                  align="justify"
                  narrow-indicator
                >
                  <q-tab name="residents" icon="elderly" :label="`Residentes (${selectedResidence.listResidents?.length || 0})`" />
                  <q-tab name="employees" icon="badge" :label="`Trabajadores (${selectedResidence.listEmployees?.length || 0})`" />
                  <q-tab name="owners" icon="admin_panel_settings" :label="`Dueños (${selectedResidence.listOwners?.length || 0})`" />
                </q-tabs>

                <q-separator />

                <q-tab-panels v-model="activeTab" animated class="bg-white">

                  <q-tab-panel name="residents" class="q-pa-none">
                    <q-list separator>
                      <q-item v-for="person in selectedResidence.listResidents" :key="person.userId" class="q-py-md">
                        <q-item-section avatar>
                          <q-avatar color="blue-2" text-color="blue-8" icon="person" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label class="text-weight-bold">{{ person.firstName }} {{ person.firstSurname }}</q-item-label>
                          <q-item-label caption>RUN: {{ person.run }}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-btn flat round color="primary" icon="visibility" size="sm">
                            <q-tooltip>Ver ficha médica/detalle</q-tooltip>
                          </q-btn>
                        </q-item-section>
                      </q-item>
                      <q-item v-if="!selectedResidence.listResidents?.length">
                        <q-item-section class="text-grey text-center q-pa-md">No hay residentes registrados.</q-item-section>
                      </q-item>
                    </q-list>
                  </q-tab-panel>

                  <q-tab-panel name="employees" class="q-pa-none">
                    <q-list separator>
                      <q-item v-for="person in selectedResidence.listEmployees" :key="person.userId" class="q-py-md">
                        <q-item-section avatar>
                          <q-avatar color="teal-2" text-color="teal-8" icon="badge" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label class="text-weight-bold">{{ person.firstName }} {{ person.firstSurname }}</q-item-label>
                          <q-item-label caption>RUN: {{ person.run }}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-chip size="sm" :color="person.state === 'Aprobado' ? 'positive' : 'warning'" text-color="white">
                            {{ person.state }}
                          </q-chip>
                        </q-item-section>
                      </q-item>
                      <q-item v-if="!selectedResidence.listEmployees?.length">
                        <q-item-section class="text-grey text-center q-pa-md">No hay trabajadores registrados.</q-item-section>
                      </q-item>
                    </q-list>
                  </q-tab-panel>

                  <q-tab-panel name="owners" class="q-pa-none">
                    <q-list separator>
                      <q-item v-for="person in selectedResidence.listOwners" :key="person.userId" class="q-py-md">
                        <q-item-section avatar>
                          <q-avatar color="orange-2" text-color="orange-8" icon="admin_panel_settings" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label class="text-weight-bold">{{ person.firstName }} {{ person.firstSurname }}</q-item-label>
                          <q-item-label caption>RUN: {{ person.run }}</q-item-label>
                        </q-item-section>
                        <q-item-section side>
                          <q-chip size="sm" :color="person.state === 'Aprobado' ? 'positive' : 'warning'" text-color="white">
                            {{ person.state }}
                          </q-chip>
                        </q-item-section>
                      </q-item>
                      <q-item v-if="!selectedResidence.listOwners?.length">
                        <q-item-section class="text-grey text-center q-pa-md">No hay dueños registrados.</q-item-section>
                      </q-item>
                    </q-list>
                  </q-tab-panel>

                </q-tab-panels>
              </q-card>
            </div>

          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <pagination-controls
      v-if="residenceStore.residences && residenceStore.residences.length > 0 && !isLoading"
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
      <div class="text-subtitle2">No se encontraron residencias para mostrar</div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { date, useQuasar } from 'quasar';

import { useUserStore } from 'stores/user';
import pinia from 'src/stores';
import PaginationControls from 'pages/private/components/PaginationControls.vue';
import { useResidenceStore } from 'stores/residence';

export default defineComponent({
  name: 'ResidencesComponent',

  components: { PaginationControls },

  setup() {
    const userStore = useUserStore(pinia());
    const residenceStore = useResidenceStore(pinia());
    const filter = ref('');
    const isLoading = ref(false);
    const $q = useQuasar();

    const currentPage = computed({
      get: () => {
        const offset = userStore.offset || 0;
        const limit = userStore.limit || 10;
        return Math.floor(offset / limit) + 1;
      },
      set: (val) => {
        changePage(val);
      }
    });

    const currentRowsPerPage = computed(() => userStore.limit);

    const totalPages = computed(() => userStore.totalPage || 0);

    const refreshData = async () => {
      try {
        isLoading.value = true;
        await residenceStore.getResidences();
      } catch (e) {
        console.error(e);
      } finally {
        isLoading.value = false;
      }
    };

    const changePage = async (newPage: number) => {
      const newOffset = (newPage - 1) * userStore.limit;
      userStore.$patch({ offset: newOffset });
      await refreshData();
    };

    const changeRowsPerPage = async (newLimit: number) => {
      userStore.$patch({
        limit: newLimit,
        offset: 0
      });
      await refreshData();
    };
    const filteredResidences = computed(() => residenceStore.residences ?? []);

    const getFullName = (row: any) => {
      return `${row.firstName} ${row.secondName || ''} ${row.firstSurname} ${row.secondSurname || ''}`.trim().replace(/\s+/g, ' ');
    };

    const formatDate = (dateString: any) => date.formatDate(dateString, 'DD/MM/YYYY');

    const getActiveRoles = (rolesObj: any) => {
      if (!rolesObj) return [];
      return Object.keys(rolesObj).filter(key => rolesObj[key] === true);
    };

    const detailsDialog = ref(false);

    const selectedResidence = ref<any>(null);

    const activeTab = ref('residents');

    const openResidenceDetails = (residence: any) => {
      selectedResidence.value = residence;
      detailsDialog.value = true;
    };

    const openDialogEdit = (residence: any) => {
      console.log(residence);
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
          icon: 'delete'
        },
        cancel: {
          label: 'Cancelar',
          color: 'grey-8',
          flat: true
        },
        persistent: true
      }).onOk(async () => {
        try {

          const response = await residenceStore.deleteResidence(residence.companyId);

          if (response) {
            $q.notify({
              type: 'positive',
              message: `La residencia ${residence.name} fue eliminada con éxito.`,
              position: 'top-right'
            });
            await residenceStore.getResidences();
          }
        } catch (error) {
          $q.notify({
            type: 'negative',
            message: 'Ocurrió un error al intentar eliminar la residencia.',
            position: 'top-right'
          });
        }
      });
    };

    onMounted(() => {
      refreshData();
    });

    return {
      userStore,
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

      openResidenceDetails,
      changePage,
      changeRowsPerPage,
      getFullName,
      formatDate,
      getActiveRoles,

      openDialogEdit,
      openDialogDelete
    }
  }
})
</script>

<style scoped>
.residence-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.residence-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0,0,0,0.15);
}
</style>
