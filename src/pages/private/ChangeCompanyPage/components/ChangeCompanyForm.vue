<template>
  <q-form>
    <q-select
      v-model="companySelected"
      :options="companies"
      option-label="companyName"
      emit-value
      map-options
      options-selected-class="black"
      label="Empresa"
      bg-color="white"
      filled
      @update:model-value="handleSelection"
    />
  </q-form>
</template>

<script lang="ts">

import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Company } from 'src/interfaces/companies/companies.interfaces';
import { useCompanyStore } from 'stores/company';
import pinia from 'src/stores';
import { useAreaStore } from 'stores/area';

export default defineComponent({
  name: 'ChangeCompanyForm',

  setup() {
    const companySelected = ref<Company>();
    const companyStore = useCompanyStore(pinia());
    const areaStore = useAreaStore(pinia());
    const router = useRouter();

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

    const handleSelection = async () => {
      await localStorage.setItem('company', JSON.stringify(companySelected.value));
      areaStore.resetState();
      router.push({ name: 'Home' });
    }

    return {
      companySelected,
      companies,

      handleSelection
    }
  }
})
</script>
