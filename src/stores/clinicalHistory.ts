import { defineStore } from 'pinia';

import { AxiosResponse } from 'axios';
import apiClient from 'src/plugins/axios';

interface ClinicalHistoryState {
  clinicalHistory: any;
}

export const useClinicalHistoryStore = defineStore('clinicalHistory', {
  state: (): ClinicalHistoryState => ({
    clinicalHistory: {}
  }),

  actions: {
    async getClinicalHistoryForResident(residentId: number): Promise<any> {

      try {
        const response: AxiosResponse = await apiClient.get(
          `/${process.env.CONTEXT_API_PRIVATE}/clinical-histories/by-resident?residentId=${residentId}`
        )

        this.clinicalHistory = response.data.clinicalHistory;

        return response.data.clinicalHistory;
      } catch (error) {
        console.log('Error en getClinicalHistoryForResident', error);

      }
    },

    async editClinicalHistory(clinicalHistoryId: number, history: any): Promise<any> {
      try {
        const response: AxiosResponse = await apiClient.put(
          `/${process.env.CONTEXT_API_PRIVATE}/clinical-histories/${clinicalHistoryId}`,
          history
        )

        this.clinicalHistory = response.data.clinicalHistory;

        if (response) {
          return response.data;
        }
      } catch (error) {
        console.log('Error en editClinicalHistory', error);

      }
    },

    async createClinicalHistory(history: any): Promise<any> {
      try {
        const response: AxiosResponse = await apiClient.post(
          `/${process.env.CONTEXT_API_PRIVATE}/clinical-histories`,
          history
        )

        this.clinicalHistory = response.data.clinicalHistory;

        if (response) {
          return response.data;
        }
      } catch (error) {
        console.log('Error en createClinicalHistory', error);

      }
    }
  }
})
