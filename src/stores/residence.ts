import { defineStore } from 'pinia';
import { AxiosResponse } from 'axios';

import apiClient from 'src/plugins/axios';
import { Company, NewCompany } from 'src/interfaces/companies/companies.interfaces';

interface ResidenceState {
  residences: Company[] | null;
  limit: number;
  offset: number;
  order: string;
  orderBy: string;
  totalPage: number | null
}

export const useResidenceStore = defineStore('residence', {
  state: (): ResidenceState => ({
    residences: [],
    limit: 10,
    offset: 0,
    order: 'ASC',
    orderBy: 'run',
    totalPage: null
  }),

  actions: {
    /* async getUsersPagination() {
      try {
        this.users = [];
        const response: AxiosResponse<{ data: { count: number, rows: User[] }, statusCode: number, send: string }> = await apiClient.post(
          '/users/pagination',
          {
            limit: this.limit,
            offset: this.offset,
            order: this.order,
            orderBy: this.orderBy
          }
        );

        const count = response.data.data.count;
        this.users = response.data.data.rows;
        this.totalPage = count / this.limit < 1 ? 1 : Math.ceil(count / this.limit);
      } catch (error) {
        console.log('Error en getUsersPagination', error);
      }
    }, */

    async getResidences() {
      try {
        const response: AxiosResponse<{ data: Company[], statusCode: number, send: string }> = await apiClient.get(
          '/companies'
        );

        console.log(response);
      } catch (error) {
        console.log('Error en getResidences', error);
      }
    },

    async createResidence(newCompany: NewCompany) {
      try {
        const response: AxiosResponse = await apiClient.post<{ data: { data: number; send: string; statusCode: number }}>(
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

    /* async createAdminUser(newUser: CreateUserPayload) {
      try {
        const response: AxiosResponse = await apiClient.post(
          '/users/admin',
          newUser
        );

        console.log(response);
        return response;
      } catch (error) {
        console.log('Error en createAdminUser', error);
      }
    } */
  }
})
