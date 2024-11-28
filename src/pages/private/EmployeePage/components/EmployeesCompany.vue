<template>
  <q-table
    flat
    bordered
    :rows="employees ?? []"
    :columns="columnsEmployee"
    row-key="name"
    v-model:pagination="pagination"
    hide-pagination
    :grid="$q.screen.xs"
    no-data-label="Sin datos disponibles"
  >
    <template v-slot:body="props" v-if="$q.screen.gt.xs">
      <q-tr :props="props">
        <q-td key="name" :props="props">
          {{ props.row.firstName }} {{ props.row.paternalSurname }}
          {{ props.row.maternalSurname }}
        </q-td>
        <q-td key="rut" :props="props">
          {{ props.row.rut }}
        </q-td>
        <q-td key="createdAt" :props="props">
          {{ formatDate(props.row.createdAt) }}
        </q-td>
        <q-td key="actions" :props="props">
          <q-btn
            flat
            round
            icon="personal_injury"
            @click="editEmployee(props.row.id)"
          >
            <q-tooltip> Accidentes del trabajador </q-tooltip>
          </q-btn>
          <q-btn flat round icon="edit" @click="editEmployee(props.row.id)">
            <q-tooltip> Editar trabajador </q-tooltip>
          </q-btn>
          <q-btn flat round icon="delete" @click="openDeleteEmployee(props.row.id)">
            <q-tooltip> Eliminar trabajador </q-tooltip>
          </q-btn>
        </q-td>
      </q-tr>
    </template>

    <template v-slot:item="props" v-if="$q.screen.xs">
      <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
        <q-card flat bordered>
          <q-card-section horizontal>
            <q-card-section class="col">
              <div class="text-grey-7 text-h6">
                {{ props.row.areaName }}
              </div>
            </q-card-section>

            <q-separator vertical />

            <q-card-actions vertical class="justify-around">
              <q-btn flat round icon="edit" @click="editEmployee(props.row.id)" />
              <q-btn
                flat
                round
                icon="delete"
                @click="openDeleteEmployee(props.row.id)"
              />
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

  <confirm-dialog
    v-model:show-dialog="showDialogDelete"
    :title="`Eliminar ${selectedEmployee?.firstName} ${selectedEmployee?.paternalSurname} ${selectedEmployee?.maternalSurname}`"
    text="¿Estás seguro de eliminar este trabajador?"
    @accept="deleteEmployee"
  />

  <new-employee-dialog
    title="Editar Trabajador"
    v-model:show-dialog="showDialogEdit"
    :employee-edit="selectedEmployee"
    is-edit
    @accept="acceptEdit"
  />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

import { globalMixin } from 'src/mixins/globalMixin';
import pinia from 'src/stores';
import ConfirmDialog from 'components/ConfirmDialog.vue';
import { Notify } from 'quasar';
import { Employee } from 'src/interfaces/employees.interface';
import { useEmployeeStore } from 'stores/employee';
import NewEmployeeDialog from 'pages/private/EmployeePage/components/NewEmployeeDialog.vue';

export default defineComponent({
  name: 'EmployeesCompany',
  components: { NewEmployeeDialog, ConfirmDialog },

  mixins: [globalMixin],

  props: {
    employees: {
      type: Array,
      required: true,
    },
  },

  emits: ['getEmployees'],

  setup(props, { emit }) {
    const showDialogEdit = ref(false);
    const showDialogDelete = ref(false);

    const employeeStore = useEmployeeStore(pinia());

    const selectedEmployee = ref<Employee>();

    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 5,
    });

    const columnsEmployee = [
      {
        name: 'name',
        required: true,
        label: 'Nombre',
        align: 'left' as const,
        field: (row: Employee) => row.firstName,
        format: (val: string) => `${val}`,
        sortable: true,
      },
      {
        name: 'rut',
        label: 'Rut',
        field: 'rut',
        sortable: false,
      },
      {
        name: 'createdAt',
        label: 'Fecha creación',
        field: 'createdAt',
        sortable: false,
      },
      {
        name: 'actions',
        label: 'Acciones',
        align: 'center' as const,
        field: 'actions',
        sortable: false,
      },
    ];

    const editEmployee = (id: number) => {
      selectedEmployee.value = employeeStore.employees?.find(
        (employee) => employee.id === id
      );

      showDialogEdit.value = true;
    };

    const deleteEmployee = async () => {
      await employeeStore.deleteEmployee(selectedEmployee.value!.id);

      emit('getEmployees');
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

    const acceptEdit = () => {
      emit('getEmployees');
    };

    return {
      columnsEmployee,
      pagination,
      pagesNumber: computed(() =>
        Math.ceil(props.employees!.length / pagination.value.rowsPerPage)
      ),
      showDialogDelete,
      showDialogEdit,
      selectedEmployee,

      editEmployee,
      openDeleteEmployee,
      acceptEdit,
      deleteEmployee,
    };
  },
});
</script>
