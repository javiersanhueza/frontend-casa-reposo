<template>
  <q-table
    flat
    bordered
    :rows="companies ?? []"
    :columns="columnsCompany"
    row-key="companyName"
    v-model:pagination="pagination"
    hide-pagination
    :grid="$q.screen.xs"
    no-data-label="Sin datos disponibles"
  >
    <template v-slot:body="props" v-if="$q.screen.gt.xs">
      <q-tr :props="props">
        <q-td key="companyName" :props="props">
          {{ props.row.companyName }}
        </q-td>
        <q-td key="companyRut" :props="props">
          {{ props.row.companyRut }}
        </q-td>
        <q-td key="createdAt" :props="props">
          {{ formatDate(props.row.createdAt) }}
        </q-td>
        <q-td key="actions" :props="props">
          <q-btn
            flat
            round
            icon="edit"
            @click="editCompany(props.row.id)"
          />
          <q-btn
            flat
            round
            icon="delete"
            @click="openDeleteCompany(props.row.id)"
          />
        </q-td>
      </q-tr>
    </template>

    <template v-slot:item="props" v-if="$q.screen.xs">
      <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
        <q-card flat bordered>
          <q-card-section horizontal>
            <q-card-section class="col">
              <div class="text-grey-7 text-h6">
                {{ props.row.companyName }}
              </div>
              <div class="text-caption">{{ props.row.companyRut }}</div>
            </q-card-section>

            <q-separator vertical />

            <q-card-actions vertical class="justify-around">
              <q-btn
                flat
                round
                icon="edit"
                @click="editCompany(props.row.id)"
              />
              <q-btn
                flat
                round
                icon="delete"
                @click="openDeleteCompany(props.row.id)"
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
    v-model:showDialog="showDialogDelete"
    :title="`Eliminar ${selectedCompany?.companyName}`"
    text="¿Estás seguro de eliminar esta empresa?"
    @accept="deleteCompany"
  />

  <new-company-dialog
    title="Editar Empresa"
    v-model:show-dialog="showDialogEdit"
    :company-name="selectedCompany?.companyName"
    :company-rut="selectedCompany?.companyRut"
    :company-id="selectedCompany?.id"
    is-edit
    @accept="acceptEdit"
  />
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';

import { Company } from 'src/interfaces/companies/companies.interfaces';
import { useCompanyStore } from 'stores/company';
import pinia from 'src/stores';

import ConfirmDialog from 'components/ConfirmDialog.vue';
import { Notify } from 'quasar';
import NewCompanyDialog from 'pages/private/CompanyPage/components/NewCompanyDialog.vue';
import { globalMixin } from 'src/mixins/globalMixin';

export default defineComponent({
  name: 'CompaniesUser',
  components: { NewCompanyDialog, ConfirmDialog },

  mixins: [globalMixin],

  props: {
    companies: {
      type: Array,
      required: true,
    },
  },

  emits: ['getCompanies'],

  setup(props, { emit }) {
    const showDialogEdit = ref(false);
    const showDialogDelete = ref(false);
    const companyStore = useCompanyStore(pinia());

    const selectedCompany = ref<Company>();
    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 5,
    });

    const columnsCompany = [
      {
        name: 'companyName',
        required: true,
        label: 'Nombre',
        align: 'left' as const,
        field: (row: Company) => row.companyName,
        format: (val: string) => `${val}`,
        sortable: true,
      },
      {
        name: 'companyRut',
        align: 'center' as const,
        label: 'Rut',
        field: 'companyRut',
        sortable: true,
      },
      {
        name: 'createdAt',
        label: 'Fecha creación',
        field: 'createdAt',
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

    const editCompany = (id: number) => {
      selectedCompany.value = companyStore.companies?.find(
        (company) => company.id === id
      );
      showDialogEdit.value = true;
    };

    const deleteCompany = async () => {
      await companyStore.deleteCompanyForUser(selectedCompany!.value?.id);

      emit('getCompanies');
      showDialogDelete.value = false;

      Notify.create({
        type: 'positive',
        message: 'Empresa eliminada con éxito',
        position: 'top',
        timeout: 3000,
      });
    };

    const openDeleteCompany = (id: number) => {
      selectedCompany.value = companyStore.companies?.find(
        (company) => company.id === id
      );
      showDialogDelete.value = true;
    };

    const acceptEdit = () => {
      emit('getCompanies')
    }

    return {
      columnsCompany,
      pagination,
      showDialogEdit,
      showDialogDelete,
      selectedCompany,

      editCompany,
      deleteCompany,
      pagesNumber: computed(() =>
        Math.ceil(props.companies!.length / pagination.value.rowsPerPage)
      ),
      openDeleteCompany,
      acceptEdit
    };
  },
});
</script>
