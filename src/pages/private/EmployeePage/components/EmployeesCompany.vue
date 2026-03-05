<template>
  <div class="row items-center justify-between q-mb-md">
    <div class="text-h5 text-weight-bold text-grey-9">
      <q-icon name="badge" color="primary" class="q-mr-sm" size="md" />
      Trabajadores
    </div>

    <div class="row items-center q-gutter-md col-12 col-sm-auto q-mt-sm q-mt-sm-none">
      <q-input
        outlined
        dense
        v-model="filter"
        placeholder="Buscar trabajador..."
        clearable
        bg-color="white"
        class="shadow-1"
        style="border-radius: 8px; min-width: 250px;"
        @clear="filter = ''"
      >
        <template v-slot:prepend>
          <q-icon name="search" color="grey-6" />
        </template>
      </q-input>

      <q-btn
        unelevated
        color="primary"
        icon="add"
        label="Nuevo Trabajador"
        class="text-weight-bold q-py-sm shadow-2"
        style="border-radius: 8px;"
        @click="openDialogCreate"
      />
    </div>
  </div>

  <q-card class="shadow-2" style="border-radius: 12px">
    <q-card-section>
      <q-table
        flat
        grid
        :rows="filteredEmployees"
        row-key="employeeId"
        :filter="filter"
        no-data-label="No hay trabajadores registrados"
        hide-bottom
        class="bg-transparent q-pa-md"
        :pagination="{ rowsPerPage: currentRowsPerPage }"
      >
        <template v-slot:item="props">
          <div class="q-pa-sm col-12 col-sm-6 col-md-4 col-lg-3">
            <q-card
              class="employee-card shadow-1 transition-ease bg-white h-100 column"
            >
              <q-card-section class="text-center q-pb-sm">
                <q-avatar size="72px" class="shadow-2 q-mb-md">
                  <img
                    v-if="props.row.photo"
                    :src="props.row.photo"
                    alt="avatar"
                  />
                  <q-icon
                    v-else
                    name="person"
                    color="white"
                    class="bg-primary"
                  />
                </q-avatar>

                <div class="text-h6 text-weight-bold text-grey-9 ellipsis">
                  {{ props.row.firstName }} {{ props.row.firstSurname }}
                </div>

                <div class="text-caption text-grey-6 q-mb-sm">
                  RUN: {{ props.row.run }}
                </div>

                <q-badge
                  color="teal-1"
                  text-color="teal-9"
                  class="text-weight-bold q-px-sm q-py-xs"
                  style="border-radius: 6px"
                >
                  {{ props.row.role || 'Sin rol asignado' }}
                </q-badge>
              </q-card-section>

              <q-space /> <q-separator inset class="q-my-sm" />

              <q-card-actions align="around" class="q-pt-none q-pb-sm">
                <q-btn
                  flat
                  dense
                  color="primary"
                  icon="edit"
                  label="Editar"
                  class="text-weight-medium"
                  @click="openDialogEdit(props.row)"
                />
                <q-btn
                  flat
                  dense
                  color="negative"
                  icon="delete_outline"
                  label="Eliminar"
                  class="text-weight-medium"
                  @click="confirmDelete(props.row)"
                />
              </q-card-actions>
            </q-card>
          </div>
        </template>
      </q-table>
    </q-card-section>

    <q-card-section
      class="bg-white"
      style="border-radius: 0 0 12px 12px; border-top: 1px solid #eee"
      v-if="filteredEmployees.length > 0"
    >
      <pagination-controls
        :model-value="currentPage"
        @update:model-value="changePage"
        :total-page="totalPages"
        :initial-rows-per-page="currentRowsPerPage"
        @rows-per-page-change="changeRowsPerPage"
      />
    </q-card-section>
  </q-card>

  <employee-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :employee-edit="employeeToEdit"
    @submitted="handleEmployeeSubmit"
  />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { Notify, useQuasar } from 'quasar';

import { globalMixin } from 'src/mixins/globalMixin';
import pinia from 'src/stores';
import { Employee } from 'src/interfaces/employees.interface';
import { useEmployeeStore } from 'stores/employee';
import PaginationControls from 'pages/private/components/PaginationControls.vue';
import EmployeeDialog from 'pages/private/EmployeePage/components/NewEmployeeDialog.vue';

export default defineComponent({
  name: 'EmployeesCompany',
  components: { EmployeeDialog, PaginationControls },

  mixins: [globalMixin],


  emits: ['getEmployees'],

  setup() {
    const showDialogEdit = ref(false);
    const showDialogDelete = ref(false);

    const employeeStore = useEmployeeStore(pinia());
    const filter = ref('');

    const selectedEmployee = ref<Employee>();
    const $q = useQuasar();

    const filteredEmployees = computed(() => employeeStore.employees ?? []);

    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 5,
    });

    const confirmDelete = (row: any) => {
      $q.dialog({
        title: 'Confirmar Eliminación',
        message: `¿Estás seguro de eliminar a ${row.firstName} ${row.firstSurname}? Esta acción no se puede deshacer.`,
        persistent: true,
        ok: { color: 'negative', label: 'Sí, Eliminar', unelevated: true },
        cancel: { color: 'grey-8', flat: true, label: 'Cancelar' },
      }).onOk(async () => {
        $q.loading.show();
        try {
          // await employeeStore.deleteEmployee(row.employeeId);
          $q.notify({ type: 'positive', message: 'Trabajador eliminado' });
          await refreshData();
        } catch (error) {
          $q.notify({ type: 'negative', message: 'Error al eliminar' });
        } finally {
          $q.loading.hide();
        }
      });
    };

    const currentPage = computed({
      get: () =>
        Math.floor((employeeStore.offset || 0) / (employeeStore.limit || 10)) +
        1,
      set: (val) => changePage(val),
    });
    const currentRowsPerPage = computed(() => employeeStore.limit);
    const totalPages = computed(() => employeeStore.totalPage || 0);

    const employeeToEdit = ref<any>(null);
    const dialogVisible = ref(false);
    const dialogTitle = ref('Nuevo Trabajador');

    const openDialogEdit = (row: any) => {
      employeeToEdit.value = { ...row }; // Copia profunda simple
      dialogTitle.value = 'Editar Trabajador';
      dialogVisible.value = true;
    };

    const changePage = async (newPage: number) => {
      const newOffset = (newPage - 1) * employeeStore.limit;
      employeeStore.$patch({ offset: newOffset });
      await refreshData();
    };

    const changeRowsPerPage = async (newLimit: number) => {
      employeeStore.$patch({ limit: newLimit, offset: 0 });
      await refreshData();
    };

    const refreshData = async () => {
      await employeeStore.getEmployeesPagination();
    };

    const deleteEmployee = async () => {
      await employeeStore.deleteEmployee(selectedEmployee.value!.id);

      showDialogDelete.value = false;

      Notify.create({
        type: 'positive',
        message: 'Trabajador eliminado con éxito',
        position: 'top',
        timeout: 3000,
      });
    };

    const openDeleteEmployee = (id: number) => {
      selectedEmployee.value = employeeStore.employees?.find(
        (employee) => employee.id === id
      );
      showDialogDelete.value = true;
    };

    const openDialogCreate = () => {
      employeeToEdit.value = null;
      dialogTitle.value = 'Nuevo Trabajador';
      dialogVisible.value = true;
    };

    const handleEmployeeSubmit = async (payload: any) => {
      console.log(payload);
      dialogVisible.value = false;
      $q.loading.show({ message: 'Guardando...' });

      try {
        if (employeeToEdit.value) {
          $q.notify({ type: 'positive', message: 'Trabajador actualizado' });
        } else {
          $q.notify({ type: 'positive', message: 'Trabajador creado' });
        }
        await refreshData();
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Error al procesar la solicitud',
        });
      } finally {
        $q.loading.hide();
      }
    };

    return {
      pagination,
      showDialogDelete,
      showDialogEdit,
      selectedEmployee,
      filter,
      filteredEmployees,
      totalPages,
      currentRowsPerPage,
      currentPage,
      dialogTitle,
      dialogVisible,
      employeeToEdit,

      handleEmployeeSubmit,
      openDialogEdit,
      confirmDelete,
      changeRowsPerPage,
      openDeleteEmployee,
      openDialogCreate,
      deleteEmployee,
    };
  },
});
</script>
