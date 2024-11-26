import { defineStore } from 'pinia';

import { Area } from 'src/interfaces/areas.interface';
import { AxiosResponse } from 'axios';
import apiClient from 'src/plugins/axios';
import { globalMixin } from 'src/mixins/globalMixin';

interface AreaState {
  areas: Area[] | null
}

export const useAreaStore = defineStore('area', {
  state: (): AreaState => ({
    areas: null
  }),

  getters: {

  },

  actions: {
    async getAreasForCompany() {
      const companyId = globalMixin.methods.getIdCompany();
      try {
        const response: AxiosResponse = await apiClient.get(
          `/${process.env.CONTEXT_API_PRIVATE}/areas/${companyId}`
        );

        this.areas = response.data.areas;
      } catch (error) {
        console.log('Error en getAreasForCompany', error);
      }
    },

    async createAreaForCompany(areaName: string) {
      try {
        const companyId = globalMixin.methods.getIdCompany();
        const body = {
          areaName,
          companyId
        }

        const response: AxiosResponse = await apiClient.post(
          `/${process.env.CONTEXT_API_PRIVATE}/areas`,
          body
        );

        return response.data;
      } catch (error) {
        console.log('Error en createAreaForCompany', error);
      }


    },

    async editAreaForCompany(areaName: string, areaId: number) {
      try {
        const response: AxiosResponse = await apiClient.put(
          `/${process.env.CONTEXT_API_PRIVATE}/areas/${areaId}`,
          { areaName }
        );

        return response.data;
      } catch (error) {
        console.log('Error en editAreaForCompany', error);
      }
    },

    async deleteArea(areaId: number) {
      try {
        const response: AxiosResponse = await apiClient.delete(
          `/${process.env.CONTEXT_API_PRIVATE}/areas/${areaId}`
        );

        return response.data;
      } catch (error) {
        console.log('Error en deleteArea', error);
      }
    },

    resetState() {
      this.areas = null;
    }
  }
})
