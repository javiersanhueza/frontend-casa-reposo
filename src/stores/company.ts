import { defineStore } from 'pinia';
import { AxiosResponse } from 'axios';

import apiClient from 'src/plugins/axios';
import { Company } from 'src/interfaces/companies/companies.interfaces';

interface CompanyState {
  companies: Company[] | null;
}

export const useCompanyStore = defineStore('company', {
  state: (): CompanyState => ({
    companies: null
  }),

  getters: {

  },

  actions: {
    async getCompaniesForUser() {
      try {
        const response: AxiosResponse = await apiClient.get(
          `/${process.env.CONTEXT_API_PRIVATE}/companies`
        );

        this.companies = response.data.companies;
      } catch (error) {
        console.log('Error en getCompaniesForUser', error);
      }
    },

    async createCompanyForUser(companyName: string, companyRut: string) {
      try {

        const user = localStorage.getItem('user');
        const userId = user ? JSON.parse(user).id : null;

        const body = {
          userId,
          companyName,
          companyRut
        };

        const response: AxiosResponse = await apiClient.post(
          `/${process.env.CONTEXT_API_PRIVATE}/companies`,
          body
        );

        return response.data;

      } catch (error) {
        console.log('Error en createCompanyForUser', error);
      }
    },

    async deleteCompanyForUser(companyId: number | undefined) {
      try {
        const response: AxiosResponse = await apiClient.delete(
          `/${process.env.CONTEXT_API_PRIVATE}/companies/${companyId}`,
        );

        return response.data;
      } catch (error) {
        console.log('Error en deleteCompanyForUser', error);
      }
    },

    async editCompanyForUser(companyName: string, companyId: number) {
      try {
        const response: AxiosResponse = await apiClient.put(
          `/${process.env.CONTEXT_API_PRIVATE}/companies/${companyId}`,
          { companyName }
        );

        return response.data;
      } catch (error) {
        console.log('Error en editCompanyForUser', error);
      }
    }
  }
})
