import { defineStore } from 'pinia';
import { AxiosResponse } from 'axios';

import apiClient from 'src/plugins/axios';
import { Employee, NewEmployee } from 'src/interfaces/employees.interface';
import { globalMixin } from 'src/mixins/globalMixin';

interface EmployeeState {
  employees: Employee[] | null;
  limit: number;
  offset: number;
  order: string;
  orderBy: string;
  totalPage: number | null
}

export const useEmployeeStore = defineStore('employee', {
  state: (): EmployeeState => ({
    employees: null,
    limit: 10,
    offset: 0,
    order: 'ASC',
    orderBy: 'run',
    totalPage: null
  }),

  getters: {

  },

  actions: {
    async getEmployeesPagination() {
      try {
        this.employees = [];
        const response: AxiosResponse<{ data: { count: number, rows: any[] }, statusCode: number, send: string }> = await apiClient.post(
          `/employees/pagination/companyId/${globalMixin.methods.getIdCompany()}`,
          {
            limit: this.limit,
            offset: this.offset,
            order: this.order,
            orderBy: this.orderBy
          }
        );

        const count = response.data.data.count;
        this.employees = response.data.data.rows;
        this.totalPage = count / this.limit < 1 ? 1 : Math.ceil(count / this.limit);
      } catch (error) {
        console.log('Error en getEmployeesPagination', error);
      }
    },

    async createEmployee(newEmployee: NewEmployee) {
      try {

        const response: AxiosResponse = await apiClient.post<{ data: { data: number; send: string; statusCode: number } }>(
          '/employees/simple',
          newEmployee
        );

        return response.data;

      } catch (error) {
        console.log('Error en createEmployee', error);
      }
    },

    async editEmployee(employee: NewEmployee, id: number) {
      try {

        const response: AxiosResponse = await apiClient.put<{ data: { data: number; send: string; statusCode: number } }>(
          `/employees/update/data/${id}`,
          {
            ...employee,
            gender: 'Masculino',
            nationality: 'Chilena'
          }
        );

        return response.data;

      } catch (error) {
        console.log('Error en createEmployee', error);
      }
    },

    async getRunEmployee(run: string) {
      try {
        const response: AxiosResponse = await apiClient.get<{ data: { data: any; send: string; statusCode: number } }>(
          `/employees/one/run/${run}`
        );

        return response.data.data;
      } catch (error) {
        console.log('Error en getEmployee', error);
      }
    },

    async getEmployee(id: number) {
      try {
        const response: AxiosResponse = await apiClient.get<{ data: { data: any; send: string; statusCode: number } }>(
          `/employees/one/userId/${id}`
        );

        return response.data.data;
      } catch (error) {
        console.log('Error en getEmployee', error);
      }
    },

    async deleteEmployee(employeeId: number | undefined) {
      try {
        const response: AxiosResponse = await apiClient.delete(
          `/employees/${employeeId}`,
        );

        return response.data;
      } catch (error) {
        console.log('Error en deleteEmployee', error);
      }
    }
  }
})
