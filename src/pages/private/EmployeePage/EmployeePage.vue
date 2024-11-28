<template>
  <div class="text-h6 text-grey-7 q-mb-sm">Trabajadores</div>

  <q-card class="q-pa-md" flat style="border-radius: 10px">
    <q-card-section class="text-right">
      <q-btn
        label="Registrar trabajador"
        class="background-header"
        text-color="white"
        @click="showDialog = true"
      />
    </q-card-section>

    <q-card-section>
      <employees-company
        :employees="employees"
        @get-employees="getEmployees"
      />
    </q-card-section>
  </q-card>

  <new-employee-dialog
    title="Registrar trabajador"
    v-model:showDialog="showDialog"
    @accept="getEmployees"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

import NewEmployeeDialog from 'pages/private/EmployeePage/components/NewEmployeeDialog.vue';
import { useEmployeeStore } from 'stores/employee';
import pinia from 'src/stores';
import { Employee } from 'src/interfaces/employees.interface';
import EmployeesCompany from 'pages/private/EmployeePage/components/EmployeesCompany.vue';

export default defineComponent({
  name: 'EmployeePage',
  components: { EmployeesCompany, NewEmployeeDialog },

  setup() {
    const showDialog = ref(false);
    const employeeStore = useEmployeeStore(pinia());
    const employees = ref<Employee[]>([]);

    const getEmployees = async (page: number, limit: number) => {
      await employeeStore.getEmployees(page, limit);
      employees.value = employeeStore.employees || [];
    };

    onMounted(() => {
      if (!employeeStore?.employees?.length) {
        getEmployees(1, 10);
      } else {
        employees.value = employeeStore.employees || [];
      }
    });

    return {
      showDialog,
      employees,

      getEmployees,
    };
  },
});
</script>
