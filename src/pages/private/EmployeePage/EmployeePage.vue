<template>
  <q-page class="q-pa-md">
    <employees-company :employees="[]" />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
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

    const filter = ref('');
    const isLoading = ref(false);

    const dialogVisible = ref(false);
    const dialogTitle = ref('Nuevo Trabajador');
    const employeeToEdit = ref<any>(null);

    // --- LÓGICA DE PAGINACIÓN ---
    const currentPage = computed({
      get: () =>
        Math.floor((employeeStore.offset || 0) / (employeeStore.limit || 10)) +
        1,
      set: (val) => changePage(val),
    });
    const currentRowsPerPage = computed(() => employeeStore.limit);
    const totalPages = computed(() => employeeStore.totalPage || 0);

    const refreshData = async () => {
      isLoading.value = true;
      try {
        await employeeStore.getEmployeesPagination(); // Ajusta al método de tu store
      } catch (e) {
        $q.notify({
          type: 'negative',
          message: 'Error al cargar los trabajadores',
        });
      } finally {
        isLoading.value = false;
      }
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

    const filteredEmployees = computed(() => employeeStore.employees ?? []);

    // --- ACCIONES DEL MODAL ---
    const openDialogCreate = () => {
      employeeToEdit.value = null;
      dialogTitle.value = 'Nuevo Trabajador';
      dialogVisible.value = true;
    };

    const openDialogEdit = (row: any) => {
      employeeToEdit.value = { ...row }; // Copia profunda simple
      dialogTitle.value = 'Editar Trabajador';
      dialogVisible.value = true;
    };

    const handleEmployeeSubmit = async (payload: any) => {
      console.log(payload);
      dialogVisible.value = false;
      $q.loading.show({ message: 'Guardando...' });

      try {
        if (employeeToEdit.value) {
          // Lógica de Edición
          // await employeeStore.updateEmployee(employeeToEdit.value.employeeId, payload);
          $q.notify({ type: 'positive', message: 'Trabajador actualizado' });
        } else {
          // Lógica de Creación
          // await employeeStore.createEmployee(payload);
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

    // --- ELIMINAR (Confirmación Nativa de Quasar) ---
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

    onMounted(() => {
      refreshData();
    });

    return {
      filter,
      isLoading,
      filteredEmployees,
      currentPage,
      currentRowsPerPage,
      totalPages,
      dialogVisible,
      dialogTitle,
      employeeToEdit,

      changePage,
      changeRowsPerPage,
      openDialogCreate,
      openDialogEdit,
      handleEmployeeSubmit,
      confirmDelete,
    };
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
