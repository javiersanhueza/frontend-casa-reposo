<template>
  <div class="text-h6 text-grey-7 q-mb-sm">Empresas</div>

  <q-card class="q-pa-md" flat style="border-radius: 10px">
    <q-card-section class="text-right">
      <q-btn
        label="Crear empresa"
        class="background-header"
        text-color="white"
        @click="showDialog = true"
      />
    </q-card-section>

    <q-card-section>
      <companies-user
        :companies="companies"
        @get-companies="getCompanies"
      />
    </q-card-section>
  </q-card>

  <new-company-dialog
    title="Nueva Empresa"
    v-model:showDialog="showDialog"
    @accept="getCompanies"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

import NewCompanyDialog from 'pages/private/CompanyPage/components/NewCompanyDialog.vue';
import CompaniesUser from 'pages/private/CompanyPage/components/CompaniesUser.vue';
import { useCompanyStore } from 'stores/company';
import pinia from 'src/stores';
import { Company } from 'src/interfaces/companies/companies.interfaces';

export default defineComponent({
  name: 'CompanyPage',
  components: { CompaniesUser, NewCompanyDialog },

  setup() {
    const showDialog = ref(false);
    const companyStore = useCompanyStore(pinia());
    const companies = ref<Company[]>([]);

    const getCompanies = async () => {
      await companyStore.getCompaniesForUser();
      companies.value = companyStore.companies || [];
    }

    onMounted(() => {
      if (!companyStore?.companies?.length) {
        getCompanies();
      } else {
        companies.value = companyStore.companies || [];
      }
    });

    return {
      showDialog,
      companies,

      getCompanies
    };
  },
});
</script>
