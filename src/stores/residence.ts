import { defineStore } from 'pinia';
import { AxiosResponse } from 'axios';

import apiClient from 'src/plugins/axios';
import { Company, NewCompany } from 'src/interfaces/companies/companies.interfaces';

interface ResidenceState {
  residences: Company[] | null;
  residence: Company | null;
  limit: number;
  offset: number;
  order: string;
  orderBy: string;
  totalPage: number | null
}

export const useResidenceStore = defineStore('residence', {
  state: (): ResidenceState => ({
    residences: [],
    residence: null,
    limit: 10,
    offset: 0,
    order: 'ASC',
    orderBy: 'rut',
    totalPage: null
  }),

  actions: {
    async getResidencesPagination() {
      try {
        this.residences = [];
        const response: AxiosResponse<{ data: { count: number, rows: Company[] }, statusCode: number, send: string }> = await apiClient.post(
          '/companies/pagination',
          {
            limit: this.limit,
            offset: this.offset,
            order: this.order,
            orderBy: this.orderBy
          }
        );

        const count = response.data.data.count;
        this.residences = response.data.data.rows;
        this.totalPage = count / this.limit < 1 ? 1 : Math.ceil(count / this.limit);
      } catch (error) {
        console.log('Error en getUsersPagination', error);
      }
    },

    async getResidences() {
      try {
        const response: AxiosResponse<{ data: Company[], statusCode: number, send: string }> = await apiClient.get(
          '/companies'
        );

        this.residences = response.data.data;
      } catch (error) {
        console.log('Error en getResidences', error);
      }
    },

    async getResidence(companyId: number) {
      try {
        const response: AxiosResponse<{ data: Company, statusCode: number, send: string }> = await apiClient.get(
          `/companies/${companyId}`,
        );

        this.residence = response.data.data;
      } catch (error) {
        console.log('Error en getResidence', error);
      }
    },

    async createResidence(newCompany: NewCompany) {
      try {
        const response: AxiosResponse = await apiClient.post<{ data: { data: number; send: string; statusCode: number } }>(
          '/companies',
          newCompany
        );

        if (response.data.statusCode === 201) {
          return response.data;
        }
        return response;
      } catch (error) {
        console.log('Error en createResidence', error);
      }
    },

    async updateResidence(companyEdit: NewCompany) {
      try {
        const response: AxiosResponse = await apiClient.put<{ data: { data: number; send: string; statusCode: number } }>(
          `/companies/${companyEdit.companyId}`,
          companyEdit
        );

        if (response.data.statusCode === 201) {
          return response.data;
        }
        return response;
      } catch (error) {
        console.log('Error en createResidence', error);
      }
    },

    async deleteResidence(residenceId: number) {
      try {
        const response: AxiosResponse = await apiClient.delete<{ data: { data: number; send: string; statusCode: number } }>(
          `/companies/${residenceId}`
        );

        return response.data;
      } catch (error) {
        console.log('Error en deleteResidence', error);

      }
    }
  }
})
