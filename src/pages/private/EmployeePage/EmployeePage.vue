<template>
  <q-page class="q-pa-md">
    <employees-company />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useQuasar } from 'quasar';

import { useEmployeeStore } from 'stores/employee';
import pinia from 'src/stores';
import EmployeesCompany from 'pages/private/EmployeePage/components/EmployeesCompany.vue';

export default defineComponent({
  name: 'EmployeesPage',

  components: { EmployeesCompany },

  setup() {
    const $q = useQuasar();
    const employeeStore = useEmployeeStore(pinia());

    const refreshData = async () => {
      try {
        await employeeStore.getEmployeesPagination();
      } catch (e) {
        $q.notify({
          type: 'negative',
          message: 'Error al cargar los trabajadores',
        });
      }
    };

    onMounted(() => {
      refreshData();
    });
  },
});
</script>

<style scoped>
.employee-card {
  border-radius: 12px;
  border: 1px solid transparent;
}
.employee-card:hover {
  border-color: rgba(74, 144, 226, 0.3); /* Tu primary color con opacidad */
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08) !important;
}
.transition-ease {
  transition: all 0.3s ease;
}
.opacity-50 {
  opacity: 0.5;
}
.h-100 {
  height: 100%;
}
</style>
