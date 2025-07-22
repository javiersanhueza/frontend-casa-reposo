import { defineStore } from 'pinia';

import { AxiosResponse } from 'axios';
import apiClient from 'src/plugins/axios';
import { globalMixin } from 'src/mixins/globalMixin';
import { NewResident } from 'src/interfaces/residents.interface';

interface ResidentState {
  residents: [] | null;
}

export const useResidentStore = defineStore('resident', {
  state: (): ResidentState => ({
    residents: []
  }),

  actions: {
    async getResidentsForCompany(state: string = 'all') {
      console.log(state);
      const companyId = globalMixin.methods.getIdCompany()

      try {
        const response: AxiosResponse = await apiClient.get(
          `/${process.env.CONTEXT_API_PRIVATE}/residents?companyId=${companyId}&state=${state}`
        )

        this.residents = response.data.residents;
      } catch (error) {
        console.log('Error en getResidentsForCompany', error);

      }
    },

    async getResidentById(id: number) {
      try {
        const response: AxiosResponse = await apiClient.get(
          `/${process.env.CONTEXT_API_PRIVATE}/residents/${id}`
        )

        return response.data.resident;
      } catch (error) {
        console.log('Error en getResidentById', error);

      }
    },

    async createResident(resident: NewResident) {
      const companyId = globalMixin.methods.getIdCompany()

      try {
        const response: AxiosResponse = await apiClient.post(
          `/${process.env.CONTEXT_API_PRIVATE}/residents`,
          { ...resident, companyId }
        );

        return response.data;
      } catch (error) {
        console.log('Error en createResident', error);

      }
    },

    async retirementResident(idResident: number, date: string, reason: string) {
      try {
        const response: AxiosResponse = await apiClient.put(
          `/${process.env.CONTEXT_API_PRIVATE}/residents/retirement/${idResident}`,
          { date, reason }
        );

        return response.data;
      } catch (error) {
        console.log('Error en retirementResident', error);

      }
    },

    async editResident(idResident: number, resident: NewResident) {
      const companyId = globalMixin.methods.getIdCompany()
      try {
        const response: AxiosResponse = await apiClient.put(
          `/${process.env.CONTEXT_API_PRIVATE}/residents/${idResident}`,
          { ...resident, companyId }
        );

        return response.data;
      } catch (error) {
        console.log('Error en retirementResident', error);

      }
    }
  }
})
