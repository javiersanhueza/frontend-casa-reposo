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
    orderBy: 'rut',
    totalPage: null
  }),

  getters: {

  },

  actions: {
    async getEmployeesPagination() {
      try {
        this.employees = [];
        const response: AxiosResponse<{ data: { count: number, rows: any[] }, statusCode: number, send: string }> = await apiClient.post(
          '/employees/pagination',
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

        const companyId = globalMixin.methods.getIdCompany();

        const body = {
          ...newEmployee,
          companyId
        };

        const response: AxiosResponse = await apiClient.post(
          `/${process.env.CONTEXT_API_PRIVATE}/employees`,
          body
        );

        return response.data;

      } catch (error) {
        console.log('Error en createEmployee', error);
      }
    },

    async deleteEmployee(employeeId: number | undefined) {
      try {
        const response: AxiosResponse = await apiClient.delete(
          `/${process.env.CONTEXT_API_PRIVATE}/employees/${employeeId}`,
        );

        return response.data;
      } catch (error) {
        console.log('Error en deleteEmployee', error);
      }
    },

    async editEmployee(employeeEdit: NewEmployee, employeeId: number) {
      try {
        const response: AxiosResponse = await apiClient.put(
          `/${process.env.CONTEXT_API_PRIVATE}/employees/${employeeId}`,
          { ...employeeEdit }
        );

        return response.data;
      } catch (error) {
        console.log('Error en editEmployee', error);
      }
    }
  }
})
